/**
 * Name -> Info pairs for the available maps.
 */
const data = {
    erangel: {
        name: 'Erangel',
        dimensions: [8, 8],
    },
    miramar: {
        name: 'Miramar',
        dimensions: [8, 8],
    },
    sanhok: {
        name: 'Sanhok',
        dimensions: [4, 4],
    },
    vikendi: {
        name: 'Vikendi',
        dimensions: [6, 6],
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
 * Gets the "scale" of a map, by its name.
 * 
 * @param {String} name
 * @return {Number}
 */
const getScale = function (name) {
    const map = getInfo(name);

    return map.dimensions
};

export {
    data,
    getUri,
    getInfo,
    getScale,
};
