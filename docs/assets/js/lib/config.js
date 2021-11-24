import { DEFAULT_SETTINGS } from './constants.js';

const HASH_PREFIX = 'config:';
const SETTING_INPUT_PATTERN = /bz\[(?<phase>\d+)\]\[(?<setting>\w+)\]/;

/**
 * Converts a hash-compatible string into a config object.
 * 
 * @param {String} hash Decodable string
 * @returns {Object}
 */
const parseHash = function (hash) {
    if (hash.startsWith(`#${HASH_PREFIX}`)) {
        hash = hash.substr(HASH_PREFIX.length + 1); // Adding 1 because of the leading # that comes attached to window.location.hash!
    }

    try {
        return JSON.parse(atob(hash));
    } catch (e) {
        console.warn(`Failed to parse an invalid configuration hash! Using defaults. Error was: ${e}`);
        return DEFAULT_SETTINGS;
    }
};

/**
 * Packs a config object into a hash-compatible string, and prepends our special key.
 * 
 * @param {Object} config
 * @returns {String}
 */
const createHash = function (config) {
    const hash = btoa(JSON.stringify(config));

    return `${HASH_PREFIX}${hash}`;
};

/**
 * Returns an object representing the current configuration.
 * 
 * @returns {Object}
 */
const getCurrent = function ($configurator) {
    const formData = new FormData($configurator);
    const data = {
        bz: [],
    };

    for (let [k, v] of formData.entries()) {
        const $input = $configurator.elements[k];
        let val = coerceValue(v);
        let path = parseInputPath($input);

        _.set(data, path, val);
    }

    return data;
};

/**
 * Attempts to coerce a value into its native type.
 * 
 * @param {mixed} value
 * @returns {mixed}
 */
const coerceValue = function (v) {
    // Float?
    const float = parseFloat(v);

    if (!isNaN(float)) {
        return float;
    }

    // More types?

    return v;
};

/**
 * Applies config to the configurator form.
 * 
 * @param {Object} config
 * @param {HTMLFormElement} $configurator
 * @param {String} scope
 */
const apply = function (config, $configurator, scope = null) {
    traverse(config, function (p, v) {
        const $input = $configurator[getInputName(p)];

        $input.value = v;
    });
};

/**
 * Traverses an object and calls the closure with a "path" to each scalar value.
 * 
 * @param {Object} obj
 * @param {Function} fn
 */
const traverse = function (obj, fn, path = []) {
    for (let k in obj) {
        const val = obj[k];
        const cp = path.slice().concat([k]);

        // Null check, because technically null is an Object in JS?
        if (val !== null && typeof val === 'object') {
            traverse(val, fn, cp);

            // Move on, since we won't be setting anything at this level:
            continue;
        }

        // Ok, it's a scalar value... execute the callback:
        fn(cp, val);
    }
};

/**
 * Builds an input `name` attribute for the provided path.
 * 
 * This is basically the inverse of `getPhase()` and `getSetting()`!
 * 
 * @param {Array} path
 * @returns {String}
 */
const getInputName = function (path = []) {
    // Don't faff around. Just return the first segment if that's it:
    if (path.length === 1) {
        return path[0];
    }

    const ns = path[0];
    const segments = path.slice(1);

    return `${ns}[${segments.join('][')}]`;
}

/**
 * Parses the input name and returns a path to the config key.
 * 
 * @param {HTMLInputElement} $input 
 * @returns {Array}
 */
const parseInputPath = function ($input) {
    const name = $input.name;

    // Get the namespace
    const nsMatch = name.match(/^(\w+)/);

    // Was it just a top-level namespace?
    if (nsMatch && nsMatch[1] === name.length) {
        return name;
    }

    // Ok, we know it's present... save it for later:
    const ns = nsMatch[1];

    // Set up a place to store the expected path:
    const path = [];

    // And initialize a new string with just the stuff after the root “namespace”
    let remainder = name.substr(ns.length);

    while (remainder) {
        const segmentMatch = /\[[\w\d]+\]/.exec(remainder);
        const segment = segmentMatch ? segmentMatch[0] : null;

        if (segment) {
            // Push the path without the opening and closing brackets:
            path.push(segment.substr(1, segment.length - 2));

            remainder = remainder.substr(segment.length);
        }
    }

    return [ns, ...path.map(coerceValue)];
}

/**
 * Returns the phase number from an input's name.
 * 
 * @param {HTMLInputElement} $input
 * @returns {Number}
 */
const getPhase = function ($input) {};

/**
 * Returns the setting key from an input's name.
 * 
 * @param {HTMLInputElement} $input
 * @returns {String}
 */
const getSetting = function ($input) {};

export {
    parseHash,
    createHash,
    getCurrent,
    apply,
    getInputName,
    getPhase,
    getSetting,
};
