import type { ShapePath } from 'three';

/**
 * Parse a single SVG path `d` attribute into a ShapePath.
 * Vendored subset of three's SVGLoader — see svgPathParser.js.
 */
export declare function parsePath(d: string): ShapePath;
