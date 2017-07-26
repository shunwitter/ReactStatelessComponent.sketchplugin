
var isSymbol = function(layer) {
  return layer.isMemberOfClass(MSSymbolInstance.class());
};

var isGroup = function(layer) {
  return layer.isMemberOfClass(MSLayerGroup.class());
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
