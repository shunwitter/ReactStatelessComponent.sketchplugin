
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
