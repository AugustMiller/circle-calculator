import { DEFAULT_SETTINGS } from './constants.js';

const HASH_PREFIX = 'config:';

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
    const data = {};

    for (let [k, v] of formData.entries()) {
        data[k] = v;
    }

    return data;
};

/**
 * Returns an object representing the current configuration.
 * 
 * @returns {Object}
 */
 const apply = function (config, $configurator) {
    for (let name in config) {
        $configurator.elements[name].value = config[name];
    }
};

export {
    parseHash,
    createHash,
    getCurrent,
    apply,
};
