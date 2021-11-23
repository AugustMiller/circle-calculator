/**
 * Name -> Info pairs for the available maps.
 */
const data = {
    erangel: {
        name: 'Erangel',
        handle: 'erangel',
        size: 8000,
    },
    miramar: {
        name: 'Miramar',
        handle: 'miramar',
        size: 8000,
    },
    sanhok: {
        name: 'Sanhok',
        handle: 'sanhok',
        size: 4000,
    },
    vikendi: {
        name: 'Vikendi',
        handle: 'vikendi',
        size: 6000,
    },
    karakin: {
        name: 'Karakin',
        handle: 'karakin',
        size: 2000,
    },
    paramo: {
        name: 'Paramo',
        handle: 'paramo',
        size: 3000,
        disabled: true,
    },
    haven: {
        name: 'Haven',
        handle: 'haven',
        size: 1000,
    },
};

/**
 * Builds a map image URL from its name
 * 
 * @param {Object} map
 * @returns {String}
 */
const getImageUri = function (map) {
    return `assets/maps/${map.handle}.jpg`;
};

/**
 * Looks up a map's definition in the manifest.
 * 
 * @param {String} name
 * @return {Object}
 */
const getInfo = function (name) {
    return data[name];
};

/**
 * Gets the "size" of a map, by its name.
 * 
 * @param {String} name
 * @return {Number}
 */
const getSize = function (name) {
    const map = getInfo(name);

    return map.size;
};

/**
 * Translates a proportion unit to "real" map length for the provided map name.
 * 
 * @param {String} name
 * @param {number} pct
 */
const getRealDistance = function (name, pct) {
    return pct * getSize(name);
};

export {
    data,
    getImageUri,
    getInfo,
    getSize,
    getRealDistance,
};
