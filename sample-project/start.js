/**
 * Start the sample application for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

let Server = require('./built/SampleServer').SampleServer
new Server().start()

// "paths": {
//     "@overnightjs/core": ["../src/core"]
// }