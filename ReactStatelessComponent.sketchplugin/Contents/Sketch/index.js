@import 'ReactStatelessComponent/ReactStatelessComponent.sketchplugin/Contents/Sketch/extract.js';
@import 'ReactStatelessComponent/ReactStatelessComponent.sketchplugin/Contents/Sketch/render.js';
@import 'ReactStatelessComponent/ReactStatelessComponent.sketchplugin/Contents/Sketch/format.js';
@import 'ReactStatelessComponent/ReactStatelessComponent.sketchplugin/Contents/Sketch/utility.js';


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
  var components = extract(origin, {});
  var tags = render(components);

log(`
import React from 'react';

export default function ${origin.name()}(props) {
  return (
${tags.split("\n").map((tag) => { return '    ' + tag; }).join("\n")}
  );
}
`);

}
