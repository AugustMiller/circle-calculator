import { RENDER_WIDTH, GRIDLINE_INTERVAL } from './constants.js';

const CIRCLE_COLOR = 'white';
const CIRCLE_WIDTH = 1;

const GRIDLINE_COLOR = 'rgba(255, 255, 255, 0.25)';
const GRIDLINE_WIDTH = 0.5;

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
 * Clears the passed canvas element.
 * 
 * @param {HTMLCanvasElement} $canvas
 */
const clear = function ($canvas) {
    getContext($canvas).clearRect(
        0,
        0,
        getRenderLength(1),
        getRenderLength(1),
    );
};

/**
 * Converts a unit-coordinate to the appropriate distance in pixels.
 * 
 * @param {Number} coordinate Normalized between zero and one!
 * @returns {Number}
 */
const getRenderLength = function (u) {
    return u * RENDER_WIDTH * window.devicePixelRatio;
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
    getContext($canvas).drawImage($img, 0, 0, getRenderLength(1), getRenderLength(1));
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
const drawLine = function (ctx, [x1, y1], [x2, y2], width, color) {
    ctx.lineWidth = width * window.devicePixelRatio;
    ctx.strokeStyle = color;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
};

/**
 * Draws a rectangle to the provided context.
 * 
 * Defaults to the same appearance as a "Circle"
 * 
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array} nw Northwest corner coordinate pair
 * @param {Array} se Southeast corner coordinate pair.
 * @param {Number} width
 * @param {String} color
 */
const drawRect = function (ctx, [x1, y1], [x2, y2], width = CIRCLE_WIDTH, color = CIRCLE_COLOR) {
    ctx.lineWidth = width * window.devicePixelRatio;
    ctx.strokeStyle = color;

    ctx.beginPath();
    ctx.rect(x1, y1, x2 - x1, y2 - y1);
    ctx.stroke();
};

/**
 * Draws a circle with the specified center and radius.
 * 
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array} center Unit coordinate [x, y] pair.
 * @param {Number} radius Unit distance
 * @param {Number} width
 * @param {String} color
 */
const drawCircle = function (ctx, [x, y], radius, width = CIRCLE_WIDTH, color = CIRCLE_COLOR) {
    ctx.lineWidth = width * window.devicePixelRatio;
    ctx.strokeStyle = color;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
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
            [offset, getRenderLength(RENDER_WIDTH)],
            GRIDLINE_WIDTH * window.devicePixelRatio,
            GRIDLINE_COLOR,
        );

        // Horizontal Lines:
        drawLine(
            ctx,
            [0, offset],
            [getRenderLength(RENDER_WIDTH), offset],
            GRIDLINE_WIDTH * window.devicePixelRatio,
            GRIDLINE_COLOR,
        );
    }
};

export {
    getContext,
    clear,
    getRenderLength,
    loadImage,
    drawImage,
    drawLine,
    drawRect,
    drawCircle,
    drawGrid,
};
