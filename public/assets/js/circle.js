import * as maps from './lib/maps.js';
import * as config from './lib/config.js';
import * as drawing from './lib/drawing.js';
import {
    RENDER_WIDTH,
    DEFAULT_SETTINGS,
} from './lib/constants.js';

const $configurator = document.getElementById('configurator');
const $map = document.getElementById('map');

$map.width = RENDER_WIDTH;
$map.height = RENDER_WIDTH;

/**
 * Updates the map with an example circle progression.
 */
const updateMap = function () {
    const c = config.getCurrent($configurator);
    const h = config.createHash(c);
    const map = maps.getInfo(c.map);

    // Save the change in the page fragment:
    window.location = `#${h}`;

    // Draw the current map:
    drawing.loadImage(maps.getUri(c.map))
        .then((e) => {
            drawing.drawImage($map, e.target);
            drawing.drawGrid($map, map);
        });

    // Render representative circles:
    // BLOCKED: Finalize settings storage!
};

const settings = window.location.hash ? config.parseHash(window.location.hash) : DEFAULT_SETTINGS;

config.apply(settings, $configurator);

$configurator.addEventListener('change', updateMap);
updateMap();
