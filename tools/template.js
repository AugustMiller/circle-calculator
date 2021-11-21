// Libraries
import fs from 'fs';
import Twig from 'twig';
Twig.cache(false);

// Utilities
import Logger from './logger.js';

// Data
import { data as maps } from '../public/assets/js/lib/maps.js';

const args = process.argv.slice(2);
const command = args[0];
const logger = new Logger('Template');

const TEMPLATE = 'src/index.twig';

const compile = function () {
    const tpl = fs.readFileSync(TEMPLATE);

    Twig.renderFile(TEMPLATE, {
        maps,
    }, function (err, html) {
        if (err) {
            logger.error(err);

            return;
        }

        fs.writeFile('public/index.html', html, function (err) {
            if (err) {
                logger.error(err);

                return;
            }
        });

        logger.info(`Template written.`);
    });
}

if (command == 'watch') {
    fs.watch(TEMPLATE, function (type, fileName) {
        logger.log(`Detected update: ${fileName}`);

        compile();
    });
}

compile();
