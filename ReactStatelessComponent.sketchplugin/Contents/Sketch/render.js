@import 'ReactStatelessComponent/ReactStatelessComponent.sketchplugin/Contents/Sketch/utility.js';

/* Render React components */
/* -------------------------------------------------------------------- */

function renderJSX(components, indent = 0) {
  var brothers  = [];
  var keyLength = Object.keys(components).length;

  for (var i = 0; i < keyLength; i++) {
    var key       = Object.keys(components)[i];
    var children  = components[key].children;
    var styles    = components[key].styles;
    var tab       = ' '.repeat(indent * 2);
    if (children) {
      brother = tab + '<' + key + renderStyleAttribute(key, styles) + '>' + "\n" +
                  renderJSX(children, indent + 1) + "\n" +
                tab + '</' + key + '>';
    } else {
      brother = tab + `<${key}${renderStyleAttribute(key, styles)} />`;
    }
    brothers.push(brother);
    if (i == keyLength - 1) { indent += 1; }
  });

  return brothers.join("\n");
}

function renderStyleAttribute(key, styles) {
  if (styles) {
    return ` style={styles.${lowerFirstCase(key)}}`;
  } else {
    return null;
  }
}

function renderStyle(components, result = {}) {
  Object.keys(components).forEach(function(key) {
    var comp = components[key];
    if (comp.styles) {
      var styleKey = lowerFirstCase(key);
      result[styleKey] = comp.styles;
    }
    renderStyle(comp.children, result);
  });
  return result;
}
