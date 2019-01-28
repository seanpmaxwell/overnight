/**
 * Start the sample application for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

let Server;
if (process.argv[2] === 'customRouter') {
    Server = require('./src/CustomRouterServer');
} else {
    Server = require('./src/NormalRouterServer');
}

let server = new Server();
server.start(3000);
