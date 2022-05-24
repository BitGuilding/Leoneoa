/**
 * @fileoverview Inject Blockly's CSS synchronously.
 */
'use strict';

/**
 * Inject Blockly's CSS synchronously.
 * @namespace Blockly.Css
 */
goog.module('Blockly.Css');

const deprecation = goog.require('Blockly.utils.deprecation');


/**
 * Has CSS already been injected?
 * @type {boolean}
 * @private
 */
let injected = false;

/**
 * Add some CSS to the blob that will be injected later.  Allows optional
 * components such as fields and the toolbox to store separate CSS.
 * @param {string|!Array<string>} cssContent Multiline CSS string or an array of
 *    single lines of CSS.
 * @alias Blockly.Css.register
 */
const register = function(cssContent) {
  if (injected) {
    throw Error('CSS already injected');
  }

  if (Array.isArray(cssContent)) {
    deprecation.warn(
        'Registering CSS by passing an array of strings', 'September 2021',
        'September 2022', 'css.register passing a multiline string');
    content += ('\n' + cssContent.join('\n'));
  } else {
    // Add new cssContent in the global content.
    content += ('\n' + cssContent);
  }
};
exports.register = register;

/**
 * Inject the CSS into the DOM.  This is preferable over using a regular CSS
 * file since:
 * a) It loads synchronously and doesn't force a redraw later.
 * b) It speeds up loading by not blocking on a separate HTTP transfer.
 * c) The CSS content may be made dynamic depending on init options.
 * @param {boolean} hasCss If false, don't inject CSS
 *     (providing CSS becomes the document's responsibility).
 * @param {string} pathToMedia Path from page to the Blockly media directory.
 * @alias Blockly.Css.inject
 */
const inject = function(hasCss, pathToMedia) {
  // Only inject the CSS once.
  if (injected) {
    return;
  }
  injected = true;
  if (!hasCss) {
    return;
  }
  // Strip off any trailing slash (either Unix or Windows).
  const mediaPath = pathToMedia.replace(/[\\/]$/, '');
  const cssContent = content.replace(/<<<PATH>>>/g, mediaPath);
  // Cleanup the collected css content after injecting it to the DOM.
  content = '';

  // Inject CSS tag at start of head.
  const cssNode = document.createElement('style');
  cssNode.id = 'blockly-common-style';
  const cssTextNode = document.createTextNode(cssContent);
  cssNode.appendChild(cssTextNode);
  document.head.insertBefore(cssNode, document.head.firstChild);
};
exports.inject = inject;


