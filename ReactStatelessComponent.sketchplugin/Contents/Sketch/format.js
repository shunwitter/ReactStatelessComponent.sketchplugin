
/* Formatting Style for RN */
/* -------------------------------------------------------------------- */

function formatStringToStyleObject(style) {
  var regex = /^(\/\*.*\*\/)|;/g;
  var style = style.replace(regex, '');
  var obj = {};
  var items = style.split("\n");
  for (var i = 0; i < items.length; i++) {
    if (!items[i]) { continue; }
    var key = items[i].split(':')[0].replace(/^(\s)*/, '');
    var val = items[i].split(':')[1].replace(/^(\s)*/, '');
    var itemStyles = formatStyleForReact(key, val);
    storeStyle(obj, itemStyles);
  }
  return obj;
}

function formatStyleForReact(key, val) {

  key = toCamelCase(key);
  val = val.replace(/px/g, ''); // remove px

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

function storeStyle(obj, styles) {
  for (var i = 0; i < styles.length; i++) {
    obj[styles[i].key] = styles[i].val;
  }
  return obj;
}
