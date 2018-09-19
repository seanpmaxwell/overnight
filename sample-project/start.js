/**
 * Start the sample application for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

let Server

if(process.argv[2] === 'customRouter') {
    Server = require('./built/CustomRouterServer').CustomRouterServer
}
else {
    Server = require('./built/NormalRouterServer').NormalRouterServer
}

new Server().start()
