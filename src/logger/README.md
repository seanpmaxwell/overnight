# <a name="overnight-logger"></a> OvernightJS/logger
Despite the abundance of logging tools out there, knowing exactly which is the right one for your 
web-server, might take more time than you feel like spending. So you can start logging events right 
away, OvernightJS comes with its own logging package. From the environment variables you can easily
switch your logs to be printed out to the command line, a file, sent through your own custom logging 
logic, or turned off completely. Logs printed to the console also are printed out in different colors 
depending on whether they're a warning, error, etc. The file for holdings logs can be specified manually 
or left as the default. Let's check it out!<br>

### Installation
```batch
$ npm install --save @overnightjs/logger
```

### Guide
There's not as much to _/logger_ as there was for _/core_ and _/jwt_, so we're just going to quickly
go over what each method does and how to set it up. The logger package's main export is the
`Logger` class. You will have separate instances of `Logger` throughout your project but they will
all pull from the same environment-variables. The variables you need to set are the mode `OVERNIGHT_LOGGER_MODE`
and the filepath `OVERNIGHT_LOGGER_FILEPATH`. The mode has 4 settings `'console'`, `'file'`, `'custom'`, and `'off'`. 
_logger_ has an export `LoggerModes` which is an enum that provides all the modes if you want to
use them in code. If you do not set the mode, _logger_ will default to using `CONSOLE`. I would recommend 
using `CONSOLE` for local development, `FILE` for remote development, and `CUSTOM` or `OFF` for production. If you
want to change the settings in code, you can do so via the constructor or getters/setters.<br>

Once you've setup logger there are 4 methods to print logs. They are `info`, which prints green, `imp`, 
which prints magenta, `warn`, which prints yellow, and `err`, which prints red. Each method must be
passed the content to print as the first param. There is an optional second param which is a `boolean`.
If you pass `true` as the second param, _logger_ will use node's `util` so that the full object
gets printed. You should NOT normally use this param, but it is especially useful when debugging errors
so that you can print out the full error object and observe the stack trace.<br>

_logger_ will by default prepend every log with a datetime stamp. If you want to turn
this off, set `OVERNIGHT_LOGGER_RM_TIMESTAMP` to `"true"` in the environment files or pass `false` as the
third argument to the constructor. Like all other settings, the argument to the constructor, will override
any environment settings.<br>

Let's look at a code sample which sets the environment variables via a start script:

- In the start script
````typescript
import * as path from 'path';
import * as fs from 'fs';
import { LoggerModes } from '@overnightjs/logger';


// Set the 
const logFilePath = path.join(__dirname, '../sampleProject.log');
process.env.OVERNIGHT_LOGGER_MODE = LoggerModes.FILE; // Can also be CONSOLE, CUSTOM, or OFF
process.env.OVERNIGHT_LOGGER_FILEPATH = logFilePath;

// Remove current log file if it exists
(function removeFile() {
    try {
        fs.unlinkSync(logFilePath);
    } catch (e) { return; }
})();
````

- In the controller file
````typescript
import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import { Logger, LoggerModes } from '@overnightjs/logger';


@Controller('api/logger')
export class LoggerPracticeController {
    
    private readonly logger: Logger;
    
    constructor() {
        this.logger = new Logger();
    }


    @Get('console/:msg')
    private printLogsConsole(req: Request, res: Response): void {
        this.logger.info(req.params.msg);
        this.logger.imp(req.params.msg);
        this.logger.warn(req.params.msg);
        this.logger.err(req.params.msg);
        this.logger.err(new Error('printing out an error'));
        this.logger.err(new Error('printing out an error full'), true); // <-- print the full Error object
        res.status(200).json({msg: 'console_mode'});
    }
}
````

- The previous code-snippet will  show the following content when printed to a file:
````
IMPORTANT: [2019-04-07T19:17:28.799Z]: OvernightJS with standard express router started on port: 3000
INFO: [2019-04-07T19:18:08.939Z]: hello-logger
IMPORTANT: [2019-04-07T19:18:08.939Z]: hello-logger
WARNING: [2019-04-07T19:18:08.939Z]: hello-logger
ERROR: [2019-04-07T19:18:08.940Z]: hello-logger
ERROR: [2019-04-07T19:18:08.940Z]: Error: printing out an error
ERROR: [2019-04-07T19:18:08.956Z]: Error: printing out an error full
    at class_1.LoggerPracticeController.printLogsFile (/home/seanmaxwell/WebstormProjects/Overnight/sample-project/src/controllers/LoggerPracticeController.ts:49:20)
    at class_1.descriptor.value [as printLogsFile] (/home/seanmaxwell/WebstormProjects/Overnight/src/core/lib/PropertyDecorators.ts:36:35)
    at callBack (/home/seanmaxwell/WebstormProjects/Overnight/src/core/lib/Server.ts:78:50)
    at Layer.handle [as handle_request] (/home/seanmaxwell/WebstormProjects/Overnight/src/core/node_modules/express/lib/router/layer.js:95:5)
    at next (/home/seanmaxwell/WebstormProjects/Overnight/src/core/node_modules/express/lib/router/route.js:137:13)
    at Route.dispatch (/home/seanmaxwell/WebstormProjects/Overnight/src/core/node_modules/express/lib/router/route.js:112:3)
    at Layer.handle [as handle_request] (/home/seanmaxwell/WebstormProjects/Overnight/src/core/node_modules/express/lib/router/layer.js:95:5)
    at /home/seanmaxwell/WebstormProjects/Overnight/src/core/node_modules/express/lib/router/index.js:281:22
    at param (/home/seanmaxwell/WebstormProjects/Overnight/src/core/node_modules/express/lib/router/index.js:354:14)
    at param (/home/seanmaxwell/WebstormProjects/Overnight/src/core/node_modules/express/lib/router/index.js:365:14)
    at Function.process_params (/home/seanmaxwell/WebstormProjects/Overnight/src/core/node_modules/express/lib/router/index.js:410:3)
    at next (/home/seanmaxwell/WebstormProjects/Overnight/src/core/node_modules/express/lib/router/index.js:275:10)
    at Function.handle (/home/seanmaxwell/WebstormProjects/Overnight/src/core/node_modules/express/lib/router/index.js:174:3)
    at router (/home/seanmaxwell/WebstormProjects/Overnight/src/core/node_modules/express/lib/router/index.js:47:12)
    at Layer.handle [as handle_request] (/home/seanmaxwell/WebstormProjects/Overnight/src/core/node_modules/express/lib/router/layer.js:95:5)
    at trim_prefix (/home/seanmaxwell/WebstormProjects/Overnight/src/core/node_modules/express/lib/router/index.js:317:13)
````


- And this when printed to the console:
<img alt='overnightjs' src='https://github.com/seanpmaxwell/overnight/raw/master/loggerConsole.png' border='0'>


### Using a custom logger 
For production you'll probably have some third party logging tool like ElasticSearch or Splunk. _logger_ exports
one interface `ICustomLogger` which has one method `sendLogs()` that needs to implemented. If you created a class
which implements this interface, and add it to _logger_ through a setter or the constructor, and set the mode to `CUSTOM`, 
logger will call whatever logic you created for `sendLogs()`.

````typescript
// CustomLoggerTool.ts
import { ICustomLogger } from '@overnightjs/logger';

export class CustomLoggerTool implements ICustomLogger {

    private readonly thirdPartyLoggingApplication: ThirdPartyLoggingApplication;
    

    constructor() {
        this.thirdPartyLoggingApplication = new ThirdPartyLoggingApplication();
    }


    // Needs to be implemented
    public sendLog(content: any): void {
        this.thirdPartyLoggingApplication.doStuff(content);
    }
}
````

````typescript
// In the controller file
constructor() {
    this.customLoggerTool = new CustomLoggerTool();
}

@Get('useCustomLogger/:msg')
private useCustomLogger(req: Request, res: Response): void {
    const logger = new Logger(LoggerModes.CUSTOM, '', true, this.customLoggerTool);
    logger.rmTimestamp = true;
    logger.info(req.params.msg);
}
````
<br>
<br>
<br>

## That's All!!
Please star this repo if you found it useful. Happy web-deving :)
