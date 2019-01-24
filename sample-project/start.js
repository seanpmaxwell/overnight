/**
 * Start the sample application for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

if (process.argv[2] === 'customRouter') {
    require('./built/CustomRouterServer');
} else {
    require('./built/NormalRouterServer');
}
