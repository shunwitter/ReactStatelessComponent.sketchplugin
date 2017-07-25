function onRun(context) {

  var app       = context.api();
  var doc       = context.document;
  var selection = context.selection;

  if(selection.count() === 0){
    app.alert('Please select sometheng.', 'No component selected');
    return;
  } else if (selection.count() > 1) {
    app.alert('Please select exactly one component.', 'Too many component');
    return;
  }

  var origin = selection[0].duplicate();
  if (isSymbol(origin)) {
    origin = origin.detachByReplacingWithGroup();
  }
  var components = iterate(origin, {});

  tags = render(components);

log(`
import React from 'react';

export default function ${origin.name()}(props) {
  return (
${tags.split("\n").map((tag) => { return '    ' + tag; }).join("\n")}
  );
}
`);
}


/* Render React components */
/* -------------------------------------------------------------------- */

function render(components, indent = 0) {
  var brothers  = [];
  var keyLength = Object.keys(components).length;

  for (var i = 0; i < keyLength; i++) {
    var key       = Object.keys(components)[i];
    var children  = components[key].children
    var tab       = ' '.repeat(indent * 2);
    if (children) {
      brother = tab + '<' + key + '>' + "\n" +
                  render(children, indent + 1) + "\n" +
                tab + '</' + key + '>';
    } else {
      brother = tab + `<${key} />`;
    }
    brothers.push(brother);
    if (i == keyLength - 1) { indent += 1; }
  });

  return brothers.join("\n");
}


/* Fetch Sketch elements and extract data */
/* -------------------------------------------------------------------- */

function iterate(origin, components) {
  var children = {}
  var layers   = origin.layers();
  for (var i = 0; i < layers.length; i++) {
    target = layers[i];
    if (isSymbol(target)) {
      target = target.detachByReplacingWithGroup();
    }
    if (isGroup(target)) {
      iterate(target, children);
    } else {
      children[target.name()] = {
        styles: styleToObject(target.CSSAttributeString()),
        children: false,
      };
    }
  }
  components[origin.name()] = { children: children };
  return components;
}


/* Formatting Style for RN */
/* -------------------------------------------------------------------- */

function styleToObject(style) {
  var regex = /^(\/\*.*\*\/)|;/g;
  var style = style.replace(regex, '');
  var obj = {};
  var items = style.split("\n");
  for (var i = 0; i < items.length; i++) {
    if (!items[i]) { continue; }
    var key = items[i].split(':')[0].replace(/^(\s)*/, '');
    var val = items[i].split(':')[1].replace(/^(\s)*/, '');
    var itemStyles = formatStyleForReact(key, val);
    applyItemStyles(obj, itemStyles);
  }
  return obj;
}

function formatStyleForReact(key, val) {

  key = toCamelCase(key);
  val = removePx(val);

  var result = [{ key: key, val: val }];

  switch (result[0].key) {
    case 'background':
      result[0].key = 'backgroundColor';
      break;
    case 'boxShadow':
      var vals = result[0].val.split(' ');
      result.push({ key: 'shadowOffset',  val: { width: vals[0], height: vals[1] } });
      result.push({ key: 'shadowRadius',  val: vals[2] });
      result.push({ key: 'shadowColor',   val: vals[4] });
      result.shift();
    default:
      break;
  }
  return result;
}

function applyItemStyles(obj, styles) {
  for (var i = 0; i < styles.length; i++) {
    obj[styles[i].key] = styles[i].val;
  }
  return obj;
}

function toCamelCase(string) {
  var match = string.match(/(-.)/);
  if (match) {
    return string.slice(0, match.index)
    + string.charAt(match.index + 1).toUpperCase()
    + string.slice(match.index + 2);
  } else {
    return string;
  }
}

function removePx(string) {
  return string.replace(/px/g, '')
}

/* Utilities */
/* -------------------------------------------------------------------- */

var isSymbol = function(layer) {
  return layer.isMemberOfClass(MSSymbolInstance.class());
};

var isGroup = function(layer) {
  return layer.isMemberOfClass(MSLayerGroup.class());
}
