import MODES from "./modes.js";

const RENDER_WIDTH = 800;
const GRIDLINE_INTERVAL = 1000;
const INITIAL_CIRCLE_DIAMETER = 1;

const DEFAULT_SETTINGS = {
    map: 'erangel',
    mode: MODES.DEFAULT,
    bz: [
        { delay: 120,   wait: 300,  move: 300,  shrink: 0.5,    spread: 0.5 },
        { delay: 0,     wait: 200,  move: 140,  shrink: 0.65,   spread: 0.5 },
        { delay: 0,     wait: 150,  move: 90,   shrink: 0.5,    spread: 0.5 },
        { delay: 0,     wait: 120,  move: 60,   shrink: 0.5,    spread: 0.5 },
        { delay: 0,     wait: 120,  move: 40,   shrink: 0.5,    spread: 0.5 },
        { delay: 0,     wait: 90,   move: 30,   shrink: 0.5,    spread: 0.5 },
        { delay: 0,     wait: 90,   move: 30,   shrink: 0.5,    spread: 0.5 },
        { delay: 180,   wait: 15,   move: 15,   shrink: 0.5,    spread: 0.5 },
    ],
};

export {
    RENDER_WIDTH,
    GRIDLINE_INTERVAL,
    INITIAL_CIRCLE_DIAMETER,
    DEFAULT_SETTINGS,
};
