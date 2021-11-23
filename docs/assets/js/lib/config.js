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
        const loc = parseInput($input);

        // Is it a plain key?
        if (typeof loc === 'string') {
            data[loc] = v;

            continue;
        }

        // Otherwise, it should be a bluezone config option:
        const phase = parseInt(loc.phase);
        const setting = loc.setting;

        // Make sure we have an object to work with at the phase index:
        if (data.bz[phase]) {
            data.bz[phase][setting] = parseFloat(v);
        } else {
            data.bz[phase] = { [setting]: parseFloat(v) };
        }
    }

    return data;
};

/**
 * Applies the config schema to the configurator form.
 * 
 * @param {Object} config
 * @param {HTMLFormElement} $configurator
 */
const apply = function (config, $configurator) {
    // Set map (and other single properties):
    $configurator.elements.map.value = config.map;

    // Set phases:
    for (let phase in config.bz) {
        const settings = config.bz[phase];

        for (let prop in settings) {
            $configurator.elements[getInputName(phase, prop)].value = settings[prop];
        }
    }
};

/**
 * Builds an input `name` attribute for the provided bluezone phase value.
 * 
 * This is basically the inverse of `getPhase()` and `getSetting()`!
 * 
 * @param {Number} phase
 * @param {String} setting
 * @returns {String}
 */
const getInputName = function (phase, setting) {
    return `bz[${phase}][${setting}]`;
}

/**
 * Parses the input name and returns a config key.
 * 
 * @param {HTMLInputElement} $input 
 * @returns {Object}
 */
const parseInput = function ($input) {
    const matches = $input.name.match(SETTING_INPUT_PATTERN);

    // Not a bluezone config option? Just return the name.
    if (!matches) {
        return $input.name;
    }

    return matches.groups;
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
