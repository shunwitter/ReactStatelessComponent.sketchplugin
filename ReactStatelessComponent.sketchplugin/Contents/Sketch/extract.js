
/* Fetch Sketch elements and extract data */
/* -------------------------------------------------------------------- */

function extract(origin, components) {
  var children = {}
  var layers   = origin.layers();
  for (var i = 0; i < layers.length; i++) {
    target = layers[i];
    if (isSymbol(target)) {
      target = target.detachByReplacingWithGroup();
    }
    if (isGroup(target)) {
      extract(target, children);
    } else {
      children[target.name()] = {
        styles: formatStringToStyleObject(target.CSSAttributeString()),
        children: false,
      };
    }
  }
  components[origin.name()] = { children: children };
  return components;
}
