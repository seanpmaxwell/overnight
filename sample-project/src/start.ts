/**
 * Start the sample application for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import * as path from 'path';
import NormalRouterServer from './NormalRouterServer';
import CustomRouterServer from './CustomRouterServer';

process.env.OVERNIGHT_LOGGER_MODE = '1';
process.env.OVERNIGHT_LOGGER_FILEPATH = path.join(__dirname, 'sampleProject.log');


let server;
if (process.argv[2] === 'customRouter') {
    server = new CustomRouterServer();
} else {
    server = new NormalRouterServer();
}

server.start(3000);
