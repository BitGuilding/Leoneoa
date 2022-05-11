use strict';

/**
 * A class that manages a surface for dragging blocks.  When a
 * block drag is started, we move the block (and children) to a separate DOM
 * element that we move around using translate3d. At the end of the drag, the
 * blocks are put back in into the SVG they came from. This helps
 * performance by avoiding repainting the entire SVG on every mouse move
 * while dragging blocks.
 * @class
 */
goog.module('Blockly.BlockDragSurfaceSvg');

const dom = goog.require('Blockly.utils.dom');
const svgMath = goog.require('Blockly.utils.svgMath');
const {Coordinate} = goog.require('Blockly.utils.Coordinate');
const {Svg} = goog.require('Blockly.utils.Svg');


/**
 * Class for a drag surface for the currently dragged block. This is a separate
 * SVG that contains only the currently moving block, or nothing.
 * @param {!Element} container Containing element.
 * @constructor
 * @alias Blockly.BlockDragSurfaceSvg
 */
const BlockDragSurfaceSvg = function(container) {
  /**
   * @type {!Element}
   * @private
   */
  this.container_ = container;
  this.createDom();
};

/**
 * The SVG drag surface. Set once by BlockDragSurfaceSvg.createDom.
 * @type {?SVGElement}
 * @private
 */
BlockDragSurfaceSvg.prototype.SVG_ = null;

/**
 * This is where blocks live while they are being dragged if the drag surface
 * is enabled.
 * @type {?SVGElement}
 * @private
 */
BlockDragSurfaceSvg.prototype.dragGroup_ = null;

/**
 * Containing HTML element; parent of the workspace and the drag surface.
 * @type {?Element}
 * @private
 */
BlockDragSurfaceSvg.prototype.container_ = null;

/**
 * Cached value for the scale of the drag surface.
 * Used to set/get the correct translation during and after a drag.
 * @type {number}
 * @private
 */
BlockDragSurfaceSvg.prototype.scale_ = 1;

/**
 * Cached value for the translation of the drag surface.
 * This translation is in pixel units, because the scale is applied to the
 * drag group rather than the top-level SVG.
 * @type {?Coordinate}
 * @private
 */
BlockDragSurfaceSvg.prototype.surfaceXY_ = null;

/**
 * Cached value for the translation of the child drag surface in pixel units.
 * Since the child drag surface tracks the translation of the workspace this is
 * ultimately the translation of the workspace.
 * @type {!Coordinate}
 * @private
 */
BlockDragSurfaceSvg.prototype.childSurfaceXY_ = new Coordinate(0, 0);

/**
 * Create the drag surface and inject it into the container.
 */
BlockDragSurfaceSvg.prototype.createDom = function() {
  if (this.SVG_) {
    return;  // Already created.
  }
  this.SVG_ = dom.createSvgElement(
      Svg.SVG, {
        'xmlns': dom.SVG_NS,
        'xmlns:html': dom.HTML_NS,
        'xmlns:xlink': dom.XLINK_NS,
        'version': '1.1',
        'class': 'blocklyBlockDragSurface',
      },
      this.container_);
  this.dragGroup_ = dom.createSvgElement(Svg.G, {}, this.SVG_);
};


exports.BlockDragSurfaceSvg = BlockDragSurfaceSvg;
