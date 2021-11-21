import { RENDER_WIDTH } from './constants.js';

/**
 * Draws the specified image to the map canvas.
 * 
 * @param {Image} $img
 * @param {HTMLCanvasElement} $canvas
 */
 const drawImage = function ($img, $canvas) {
    const ctx = $canvas.getContext('2d');

    ctx.drawImage($img, 0, 0, RENDER_WIDTH, RENDER_WIDTH);
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

export {
    drawImage,
    loadImage,
};
