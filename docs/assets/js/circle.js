import * as maps from './lib/maps.js';
import * as config from './lib/config.js';
import * as drawing from './lib/drawing.js';
import MODES from './lib/modes.js';

import { ensureProperty, style } from './lib/dom.js';

import {
    RENDER_WIDTH,
    DEFAULT_SETTINGS,
    INITIAL_CIRCLE_DIAMETER,
} from './lib/constants.js';

// Primary data + rendering
const $configurator = document.getElementById('configurator');
const $canvas = document.getElementById('map');

const $squircle = document.getElementById('squircle-settings');

// Output containers
const $coordinates = document.getElementById('coordinates');
const $butthole = document.getElementById('butthole');
const $duration = document.getElementById('duration');

// Controls
const $shuffle = document.getElementById('shuffle');

// Current configuration:
let settings;

$canvas.width = RENDER_WIDTH;
$canvas.height = RENDER_WIDTH;

/**
 * Updates the map with an example circle progression.
 */
const updateMap = function () {
    // Pre-process some controls + data:
    const mode = $configurator.elements.mode.value;

    style($squircle, {
        display: mode === MODES.SQUIRCLE ? 'block' : 'none',
    });

    Array.from($configurator.elements).forEach(function ($el) {
        if (!$el.name.startsWith('squircle')) {
            return;
        }

        ensureProperty($el, 'disabled', mode !== MODES.SQUIRCLE);
    });

    // Update settings:
    settings = config.getCurrent($configurator);

    console.log('Recieved new settings:', settings);

    const h = config.createHash(settings);

    // Save the change in the page fragment:
    window.location = `#${h}`;

    // Ensure the chosen map graphic is loaded, then update the canvas:
    drawing.loadImage(maps.getImageUri(getCurrentMap())).then(function (e) {
        renderMap()
    });
};

/**
 * Returns the current map from the settings object.
 * 
 * @returns {Object}
 */
const getCurrentMap = function () {
    return maps.getInfo(settings.map);
}

/**
 * Renders the map and a representative or reference set of circles into our canvas.
 * 
 * @param {Boolean} simulated
 */
const renderMap = function (simulated = false) {
    const map = getCurrentMap();
    const $img = new Image;
    const timer = window.performance.now();

    // Re-create this? Gotta be a better way...
    $img.src = maps.getImageUri(map);

    drawing.drawImage($canvas, $img);
    drawing.drawGrid($canvas, map);

    if (settings.mode === MODES.SQUIRCLE) {
        renderSquircles(simulated);
    } else {
        renderCircles(simulated);
    }

    $duration.innerText = `Duration: ${getMatchDuration()}s`;

    console.debug(`Render took ${window.performance.now() - timer}ms.`);
};

/**
 * Renders the phase settings in Circle mode.
 * 
 * @param {Boolean} simulate
 */
const renderCircles = function (simulated = false) {
    const ctx = drawing.getContext($canvas);

    const path = [];
    let size = INITIAL_CIRCLE_DIAMETER;
    let center = { x: 0.5, y: 0.5 };

    for (let phase in settings.bz) {
        const circle = settings.bz[phase];
        const nextSize = size * circle.shrink;

        // Memoize this before we overwrite it:
        path.push([center.x, center.y]);

        // Only when doing a "simulation" is the center changed—this helps keep changes to circle proportions easier to understand.
        if (simulated) {
            const bearing = Math.random() * Math.PI * 2;

            // This is patently incorrect logic, at the moment, but I can't seem to track down any definitive explanation for the behavior!
            const spread = circle.spread / (Math.random() * 2 + 1);

            // There may not actually  be a "maximum" displacement, because the circle doesn't have to be inside the last one (as we've learned from “C4 and Cars”)!
            const maxDisplacement = (size - nextSize) / 2;

            center.x = center.x + (nextSize * Math.cos(bearing)) * spread;
            center.y = center.y + (nextSize * Math.sin(bearing)) * spread;
        }

        drawing.drawCircle(
            ctx,
            [drawing.getRenderLength(center.x), drawing.getRenderLength(center.y)],
            drawing.getRenderLength(nextSize / 2)
        );

        // Write the “current” size:
        size = nextSize;
    }

    if (simulated) {
        // Draw the path of the circle, ignoring the first segment:
        for (let s = 1; s < path.length; s++) {
            const [x1, y1] = path[s - 1];
            const [x2, y2] = path[s];

            drawing.drawLine(
                ctx,
                [drawing.getRenderLength(x1), drawing.getRenderLength(y1)],
                [drawing.getRenderLength(x2), drawing.getRenderLength(y2)],
                1,
                'green'
            );
        }
    }

    const endX = Math.round(maps.getRealDistance(settings.map, center.x));
    const endY = Math.round(maps.getRealDistance(settings.map, center.y));

    $butthole.innerText = `End: ${endX}m, ${endY}m`
};

/**
 * Renders the phase settings in Squircle mode.
 * 
 * @param {Boolean} simulated
 */
const renderSquircles = function (simulated = false) {
    if (settings.squircle === undefined) {
        throw new Error('Tried to render squircles while in the wrong mode!');
    }

    const ctx = drawing.getContext($canvas);
    const { x1, y1, x2, y2 } = settings.squircle;

    let width = x2 - x1;
    let height = y2 - y1;

    let center = {
        x: x1 + width / 2,
        y: y1 + height / 2,
    };

    for (let phase in settings.bz) {
        const squircle = settings.bz[phase];

        width = width * squircle.shrink;
        height = height * squircle.shrink;

        drawing.drawRect(
            ctx,
            [
                drawing.getRenderLength(center.x - width / 2),
                drawing.getRenderLength(center.y - height / 2)
            ],
            [
                drawing.getRenderLength(center.x + width / 2),
                drawing.getRenderLength(center.y + height / 2)
            ],
        );
    }
};

/**
 * Gets the total duration of the match, in seconds.
 */
const getMatchDuration = function () {
    return settings.bz.reduce(function (duration, phase) {
        return duration + phase.delay + phase.wait + phase.move;
    }, 0);
};

/**
 * Displays "real" map coordinates from a pointer event.
 * 
 * @param {PointerEvent} e
 */
const handleMouseover = function (e) {
    const unitX = e.offsetX / RENDER_WIDTH;
    const unitY = e.offsetY / RENDER_WIDTH;
    const x = Math.round(maps.getRealDistance(settings.map, unitX));
    const y = Math.round(maps.getRealDistance(settings.map, unitY));

    $coordinates.innerText = `Pointer: ${unitX.toFixed(2)}, ${unitY.toFixed(2)} (${x}m, ${y}m)`;
};

// Initialize with incoming or default settings:
settings = window.location.hash ? config.parseHash(window.location.hash) : DEFAULT_SETTINGS;

// Apply config to the form:
config.apply(settings, $configurator);

// Start listing for updates:
$configurator.addEventListener('change', updateMap);

// Ensure the initial config is pushed through and rendered:
updateMap();

// Final setup:
$canvas.addEventListener('mousemove', handleMouseover);
$canvas.addEventListener('mouseleave', function () {
    $coordinates.innerText = '';
});

$shuffle.addEventListener('click', function (e) {
    renderMap(true);
});
