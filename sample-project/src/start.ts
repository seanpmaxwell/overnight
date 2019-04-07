/**
 * Start the sample application for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import * as path from 'path';
import { Logger } from '@overnightjs/logger';
import NormalRouterServer from './NormalRouterServer';
import CustomRouterServer from './CustomRouterServer';


// Set env variables
const logFilePath = path.join(__dirname, '../sampleProject.log');
process.env.OVERNIGHT_LOGGER_MODE = '2';
process.env.OVERNIGHT_LOGGER_FILEPATH = logFilePath;


// Remove current log file
Logger.rmFileSync(logFilePath);


// Start Server
let server;
if (process.argv[2] === 'customRouter') {
    server = new CustomRouterServer();
} else {
    server = new NormalRouterServer();
}

server.start(3000);
