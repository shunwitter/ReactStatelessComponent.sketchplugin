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
  components = iterate(origin, {});

  log(components);
}


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
        style: styleToObject(target.CSSAttributeString()),
        children: false,
      };
    }
  }
  components[origin.name()] = children;
  return components;
}


function styleToObject(style) {
  var regrex = new RegExp('\/\*.*\*\/', 'g');
  var style = style.replace(regrex, '');
  var obj = {};
  var items = style.split("\n");
  for (var i = 0; i < items.length; i++) {
    // var key = style[i].split(':')[0].replace(RegExp('\s', 'g'), '');
    // var val = style[i].split(':')[1].replace(RegExp('\s', 'g'), '');
    obj[key] = val;
  }
  return obj;
}


var isSymbol = function(layer) {
  return layer.isMemberOfClass(MSSymbolInstance.class());
};

var isGroup = function(layer) {
  return layer.isMemberOfClass(MSLayerGroup.class());
}
