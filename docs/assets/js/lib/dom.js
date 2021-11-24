/**
 * Ensures the passed property of the element matches the provided state.
 * 
 * @param {HTMLElement} $el
 * @param {String} prop
 * @param {Boolean} state
 * @param {mixed} positiveValue
 * @param {mixed} negativeValue
 */
const ensureProperty = function ($el, prop, state = true, positiveValue = true, negativeValue = false) {
    $el[prop] = state ? positiveValue : negativeValue;
};

/**
 * Applies the provided map of styles to the element.
 * 
 * @param {HTMLElement} $el
 * @param {Object} styles
 */
const style = function ($el, styles) {
    for (let prop in styles) {
        const value = styles[prop];

        if (value instanceof Function) {
            value = value();
        }

        $el.style[prop] = value;
    }
};

export {
    ensureProperty,
    style,
};
