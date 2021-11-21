import { RENDER_WIDTH, GRIDLINE_INTERVAL } from './constants.js';

const CIRCLE_NEXT_COLOR = 'white';
const CIRCLE_WIDTH = 1;

const GRIDLINE_COLOR = 'rgba(255, 255, 255, 0.25)';
const GRIDLINE_WIDTH = 1;

/**
 * Gets a drawing context for the provided canvas.
 * 
 * @param {HTMLCanvasElement} $canvas 
 * @returns {}
 */
const getContext = function ($canvas) {
    return $canvas.getContext('2d');
};

/**
 * Converts a unit-coordinate to the appropriate distance in pixels.
 * 
 * @param {Number} coordinate Normalized between zero and one!
 * @returns {Number}
 */
const getRenderLength = function (u) {
    return u * RENDER_WIDTH;
};

/**
 * Load a new image resource for consumption by our canvas.
 * 
 * @param {String} url
 * @returns {Promise}
 */
const loadImage = function (url) {
    return new Promise(function (resolve, reject) {
        const img = new Image;
        img.addEventListener('load', resolve);

        img.src = url;
    });
};

/**
 * Draws the specified image to the map canvas.
 * 
 * @param {HTMLCanvasElement} $canvas
 * @param {Image} $img
 */
 const drawImage = function ($canvas, $img) {
    getContext($canvas).drawImage($img, 0, 0, RENDER_WIDTH, RENDER_WIDTH);
};

/**
 * Draws a line from the start coordinate pair to the end coordinate pair.
 * 
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array} start 
 * @param {Array} end
 * @param {Number} width
 * @param {String} color
 */
const drawLine = function (ctx, start, end, width, color) {
    ctx.lineWidth = width;
    ctx.strokeStyle = color;

    console.log(`Line:`, start, end);

    ctx.beginPath();
    ctx.moveTo(start[0], start[1]);
    ctx.lineTo(end[0], end[1]);
    ctx.stroke();
};

/**
 * Draws gridlines for the passed map definition.
 * 
 * @param {HTMLCanvasElement} $canvas
 * @param {Object} map
 */
const drawGrid = function ($canvas, map) {
    const ctx = getContext($canvas);
    const width = map.size;
    const localScale = 1 / width;

    for (let l = GRIDLINE_INTERVAL; l < width; l += GRIDLINE_INTERVAL) {
        const offset = getRenderLength(localScale * l);

        // Vertical Lines:
        drawLine(
            ctx,
            [offset, 0],
            [offset, RENDER_WIDTH],
            GRIDLINE_WIDTH,
            GRIDLINE_COLOR,
        );

        // Horizontal Lines:
        drawLine(
            ctx,
            [0, offset],
            [RENDER_WIDTH, offset],
            GRIDLINE_WIDTH,
            GRIDLINE_COLOR,
        );
    }
};

export {
    getContext,
    getRenderLength,
    loadImage,
    drawImage,
    drawLine,
    drawGrid,
};
