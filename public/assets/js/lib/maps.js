/**
 * Name -> Info pairs for the available maps.
 */
const data = {
    erangel: {
        name: 'Erangel',
        size: 8000,
    },
    miramar: {
        name: 'Miramar',
        size: 8000,
    },
    sanhok: {
        name: 'Sanhok',
        size: 4000,
    },
    vikendi: {
        name: 'Vikendi',
        size: 6000,
    },
    karakin: {
        name: 'Karakin',
        size: 2000,
        disabled: true,
    },
    paramo: {
        name: 'Paramo',
        size: 3000,
        disabled: true,
    },
    haven: {
        name: 'Haven',
        size: 1000,
        disabled: true,
    },
};

/**
 * Builds a map image URL from its name
 * 
 * @param {String} name
 * @returns {String}
 */
 const getUri = function (name) {
    return `assets/maps/${name}.jpg`;
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
const getScale = function (name) {
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
    return pct * getScale(name);
};

export {
    data,
    getUri,
    getInfo,
    getScale,
    getRealDistance,
};
