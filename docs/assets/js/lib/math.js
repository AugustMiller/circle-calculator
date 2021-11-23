/**
 * Scales a value in one range to another range.
 * 
 * @param {Number} num Value to scale.
 * @param {Number} inMin Lower (expected) bound of input.
 * @param {Number} inMax Upper (expected) bound of input.
 * @param {Number} outMin Lower bound of output (may be out of range).
 * @param {Number} outMax Upper bound of output (may be out of range).
 */
 const scale = function (num, inMin, inMax, outMin, outMax) {
    return (num - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
};

/**
 * Ensures a value is within the provided range.
 * 
 * @param {Number} num Value to constrain.
 * @param {Number} min Min value returned.
 * @param {Number} max Max value returned.
 */
const constrain = function (num, min, max) {
    return Math.min(Math.max(num, min), max);
};

/**
 * Takes the input and finds the nearest even number.
 * 
 * @param {Number} num Number to make even.
 */
const even = function (num) {
    return 2 * Math.round(num / 2);
};

/**
 * Takes a pair of coordinates, and returns the distance between them.
 * 
 * @param {Number} ax 
 * @param {Number} ay 
 * @param {Number} bx 
 * @param {Number} by 
 */
const pathLength = function (ax, ay, bx, by) {
    const dx = Math.abs(ax - bx);
    const dy = Math.abs(ay - by);

    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
};

export {
    constrain,
    even,
    pathLength,
    scale
};
