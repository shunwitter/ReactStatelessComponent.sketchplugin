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
  var tags = renderJSX(components);

  /* JSX */
  var tagString = `
import React from 'react';
import { StyleSheet } from 'react-native';

export default function ${origin.name()}(props) {
  return (
${tags.split("\n").map((tag) => { return '    ' + tag; }).join("\n")}
  );
}
`;
  log(tagString);

  /* Styles */
  var styles = JSON.stringify(renderStyle(components), null, 2);
  var styleString = `const styles = StyleSheet.create(${styles});`;
  log(formatStyleJSON(styleString));

}
