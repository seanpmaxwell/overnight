/**
 * Start the sample application for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import NormalRouterServer from './NormalRouterServer';
import CustomRouterServer from './CustomRouterServer';


let server;
if (process.argv[2] === 'customRouter') {
    server = new CustomRouterServer();
} else {
    server = new NormalRouterServer(process.argv[3]);
}

server.start(3000);
