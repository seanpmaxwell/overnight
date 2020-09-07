# OvernightJS

> TypeScript decorators for the ExpressJS Web Server!

<img alt='overnightjs' src='https://github.com/seanpmaxwell/overnight/raw/master/overnightjs.png' border='0'>

<a href="https://www.npmjs.com/package/@overnightjs/core" target="_blank"><img src="https://img.shields.io/npm/v/@overnightjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/package/@overnightjs/core" target="_blank"><img src="https://img.shields.io/npm/l/@overnightjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/package/@overnightjs/core" target="_blank"><img src="https://img.shields.io/npm/dm/@overnightjs/core.svg" alt="NPM Downloads" /></a>
 

## What is it
OvernightJS is a simple library to add TypeScript decorators for methods meant to call Express routes.
It also includes a package for managing json-web-tokens and printing logs. 


## Features
* Define a base route using a @Controller decorator.
* Decorators to convert class methods to Express routes (@Get, @Put, @Post, @Delete etc).
* Method decorators also work with arrow functions set as class properties.
* @Middleware and @ClassMiddleware decorators.
* @ErrorMiddleware and @ErrorMiddleware decorators to handle request errors.
* Add options to controllers the same as you would Express routers with @ClassOptions.
* Support for child-controllers with @ChildControllers.
* @Wrapper and @ClassWrapper decorators to wrap functions. 
* Server superclass to initialize ExpressJS server and setup controllers.
* Allows for adding your own custom Router classes if you don't want to use the standard express Router.
* Easy to configure logging tool.
* Json-Web-Token management.
* Master repo includes a sample application, if you want to practice with an API calling tool such as Postman.
* Compatible with both es5 and es6.
* Fully type safe :)


## Why OvernightJS
OvernightJS isn't meant to be a replacement for Express. If you're already somewhat familiar with ExpressJS, you can
learn Overnight in about 10 minutes. There are some other frameworks which do add decorators for Express such as NestJS
and TsExpressDecorators, but these are massive frameworks with entire websites dedicated to their documentation. OvernightJS
is clean, simple, and aside from the decorators, you can interact with ExpressJS in the same way you would any other Node
application.


## Table of Contents
* [OvernightJS/core](#overnight-core)
* [OvernightJS/logger](#overnight-logger)
* [OvernightJS/jwt](#overnight-jwt)



## Installation
You can get the latest release using npm:

```batch
$ npm install --save @overnightjs/core express 
$ npm install --save-dev @types/express
```

> **Important!** OvernightJS requires Node >= 6, Express >= 4, TypeScript >= 2.0 and the `experimentalDecorators`, 
`lib` compilation options in your `tsconfig.json` file.


## <a name="overnight-core"></a> Quick start

#### Create your controller

````typescript
import { OK, BAD_REQUEST } from 'http-status-codes';
import { Controller, Middleware, Get, Post, Put, Delete } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Logger } from '@overnightjs/logger';

@Controller('api/users')
export class UserController {

    @Get(':id')
    private get(req: Request, res: Response) {
        Logger.Info(req.params.id);
        return res.status(OK).json({
            message: 'get_called',
        });
    }

    @Get('')
    @Middleware([middleware1, middleware2])
    private getAll(req: ISecureRequest, res: Response) {
        Logger.Info(req.payload, true);
        return res.status(OK).json({
            message: 'get_all_called',
        });
    }

    @Post()
    private add(req: Request, res: Response) {
        Logger.Info(req.body, true);
        return res.status(OK).json({
            message: 'add_called',
        });
    }

    @Put('update-user')
    private update(req: Request, res: Response) {
        Logger.Info(req.body);
        return res.status(OK).json({
            message: 'update_called',
        });
    }

    @Delete('delete/:id')
    private delete(req: Request, res: Response) {
        Logger.Info(req.params, true);
        return res.status(OK).json({
            message: 'delete_called',
        });
    }

    @Get(/ane/) // Rexes supported. Matches /lane, /cane, etc.
    public getAne(req: Request, res: Response): any {
        return res.status(OK).json({
            message: '/ane/',
        });
    }

    @Get('practice/async')
    private async getWithAsync(req: Request, res: Response) {
        try {
            const asyncMsg = await this.asyncMethod(req);
            return res.status(OK).json({
                message: asyncMsg,
            });
        } catch (err) {
            Logger.Err(err, true);
            return res.status(BAD_REQUEST).json({
                error: err.message,
            });
        }
    }

    private asyncMethod(req: Request): Promise<string> {
        return new Promise((resolve) => {
            resolve(req.originalUrl + ' called');
        });
    }
}
````

- You don't have to use class methods, you can also use class properties whose value is an arrow function. You will
 have to cast Overnight to the 'any' type to avoid type errors though.
 
````typescript
import * as OvernightJS from '@overnightjs/core';

    ...

    @(OvernightJS as any).Get('arrow/:id')
    private get = (req: Request, res: Response) => {
        this.logger.info(req.params.id);
        return res.status(200).json({msg: 'get_arrow_called'});
    }
````

- If you want your middleware to apply to every route in a class use the `@ClassMiddleware` decorator. 

````typescript
import { Controller, ClassMiddleware } from '@overnightjs/core';

@Controller('api/users')
@ClassMiddleware([middleware1, middleware2])
export class UserController {
    
    ...
}
````

- You can set the `@ErrorMiddleware` / `@ClassErrorMiddleware` decorators to use [Express error handling](https://expressjs.com/en/guide/error-handling.html). 

````typescript
import { Controller, ErrorMiddleware, ClassErrorMiddleware } from '@overnightjs/core';

@Controller('api/users')
@ClassErrorMiddleware(errorMiddleware1)
export class UserController {
    
	@Get(':id')
	@ErrorMiddleware(errorMiddleware2)
    private get(req: Request, res: Response)
    ...
}
````

- Child-controllers can be added with the `@ChildControllers` decorator. There's no limit to how 
many levels of nesting you can add. Make sure to instantiate them before adding them. Options at the
class level can be added with `@ClassOptions` decorator. 

````typescript
import { Controller, ClassOptions, ChildControllers } from '@overnightjs/core';
import { ChildController1, ChildController2 } from '...'

@Controller('api/users')
@ClassOptions({mergeParams: true})
@ChildControllers([
    new ChildController1(), 
    new ChildController2(),
])
export class ParentController {
    
    ...
}
````

- You can wrap each class method in a custom function with the `@Wrapper` decorator. If you use the `@ClassWrapper`
decorator then every method in that class will be wrapped with the provided method. 

````typescript
import * as expressAsyncHandler from 'express-async-handler';
import { ClassWrapper, Controller, Get, Wrapper } from '@overnightjs/core';
import { Request, Response } from 'express';

@Controller('wrapper-practice')
// Or instead of using @Wrapper below you could use @ClassWrapper here
export class WrapperController {
    
    @Get('async-third-party/:id')
    @Wrapper(expressAsyncHandler)
    private async asyncThirdParty(req: Request, res: Response) {
        const asyncMsg = await someAsyncFunction();
        return res.status(200).json({
            message: asyncMsg,
        });
    }
}
````

#### Import your controllers into the server
OvernightJS provides a Server superclass which initializes a new ExpressJS application. The express 
object is accessed using `this.app`, which is a protected, readonly class variable. You can interact 
with this variable like you would any normal express Application created with `require('express')()`.
If you want to print to the console the name of each controller that has been successfully configured,
set `showLogs` to `true` via the `this.showLogs` setter or the Server `constructor()`. 
<br>

`super.addControllers()` must be called to enable all of the routes in your controller. Make sure to
call it after setting up your middleware. You can pass `super.addControllers()` a single controller-instance 
or an array of controller-instances, but they must be instantiated first.
<br>

````typescript
import * as bodyParser from 'body-parser';
import { Server } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { UserController } from './UserController';
import { SignupController } from './SignupController';

export class SampleServer extends Server {
    
    constructor() {
        super(process.env.NODE_ENV === 'development'); // setting showLogs to true
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.setupControllers();
    }

    private setupControllers(): void {
        const userController = new UserController();
        const signupController = new SignupController();
        const dbConnObj = new SomeDbConnClass('credentials');
        signupController.setDbConn(dbConnObj);
        userController.setDbConn(dbConnObj);
        // super.addControllers() must be called, and can be passed a single controller or an array of 
        // controllers. Optional router object can also be passed as second argument.
        super.addControllers(
            [userController, signupController],
            /*, optional router here*/,
            /* middleware that will apply to all controllers here */,
        );
    }

    public start(port: number): void {
        this.app.listen(port, () => {
            Logger.Imp('Server listening on port: ' + port);
        })
    }
}
````

**IMPORTANT NOTE:** If you initialize environment variables from some script which imports the 
Server script, those environment variables must be configured before importing the Server script
or else they could end up undefined for nested controllers.

#### See how awesome this is!
Without the above decorators we would have to wrap each controller method with something like:

````typescript
/* In the controller file*/
class UserController {
    
    public getRoutes(): Router {
        const router = Router();
        router.get('/', [your middleware], (req, res) => {
            // Do some stuff in here
        });
        router.get('/anotherRoute', [other middleware], (req, res) => {
            // Do some stuff in here
        });
        // Repeat for every single controller method
        return router;
    }
}

let userController = new UserController();
this.app.use('/api/users', userController.getRoutes());
// Repeat for every single controller class
````

This would get really tedious overtime and lead to a lot of boiler plate code.


#### <a name="custom-router"></a> Using a Custom Router
Suppose you don't want to use the built in "Router" object which is provided by Express. Maybe you
want use  _express-promise-router_ because you don't like using `try/catch` blocks. OvernightJS allows
you to pass in a custom router object in the `super.addControllers()` method. Simply pass in your
custom router as the second param after the controller-instance/s. When you don't specify a custom
router, the default express.Router() object is used. 


- Controller using _express-promise-router_:

````typescript
import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';

@Controller('api/posts')
export class PostController {

    @Get(':id')
    private get(req: Request, res: Response) {
        return this.someAsyncFunction(req.params.id)
                    .then(ret => res.status(200).json({msg: ret}));
    }

    private someAsyncFunction(id: number): Promise<string> {
        return new Promise((res, rej) => {
            isNaN(id) ? rej('Invalid id') : res('Valid id');
        })
    }
}
````

- Add _express-promise-router_ in the `super.addControllers()` method:

````typescript
import * as customRouter  from 'express-promise-router';
import { Server } from '@overnightjs/core';
import { PostController } from './controllers/PostController';

export class CustomRouterServer extends Server {
    
    constructor() {
        super();
        super.addControllers(new PostController(), customRouter); // <-- custom router added here
    }

    ...
}
````
<br>
<br>
<br>



## <a name="overnight-logger"></a> OvernightJS/logger
Despite the abundance of logging tools out there, knowing exactly which is the right one for your 
web-server might take more time than you feel like spending. So you can start logging events right 
away, OvernightJS comes with its own logging package. From the environment variables you can easily
switch your logs to be printed out to the command line, a file, sent through your own custom logging 
logic, or turned off completely. Logs printed to the console also are printed out in different colors 
depending on whether they're info, a warning, an error, etc. The file for holding logs can be specified
 manually or left as the default. Let's check it out!<br>

### Installation
```batch
$ npm install --save @overnightjs/logger
```

### Guide
The logger package's main export is the `Logger` class. Logger can used statically or as an instance 
with settings configured through a constructor.

- The three environment variables are:
    - `OVERNIGHT_LOGGER_MODE`: can be `'CONSOLE'`(default), `'FILE'`, `'CUSTOM'`, and `'OFF'`.
    - `OVERNIGHT_LOGGER_FILEPATH`: the file-path for file mode. Default is _home_dir/overnight.log_.
    - `OVERNIGHT_LOGGER_RM_TIMESTAMP`: removes the timestamp next to each log. Can be `'TRUE'` or `'FALSE'`(default).

_logger_ has an export `LoggerModes` which is an enum that provides all the modes if you want to
use them in code. I would recommend using `Console` for local development, `File` for remote development, 
and `Custom` or `Off` for production. If you want to change the settings in code, you can do so via 
the constructor or getters/setters.
<br>


- There are 4 functions on Logger to print logs. Each has a static counterpart:
    - `info` or `Info`: prints green.
    - `imp` or `Imp`: prints magenta. 
    - `warn` or `Warn`: prints yellow.
    - `err` or `Err`: prints red.

There is an optional second param to each method which is a `boolean`. If you pass `true` as the second 
param, Logger will use node's `util` so that the full object gets printed. You should NOT normally 
use this param, but it is especially useful when debugging errors so that you can print out the full 
error object and observe the stack trace.<br>

Let's look at a code sample which sets the environment variables via a start script:

- In the start script
````typescript
import * as path from 'path';
import * as fs from 'fs';
import { LoggerModes } from '@overnightjs/logger';

// Set the 
const logFilePath = path.join(__dirname, '../sampleProject.log');
process.env.OVERNIGHT_LOGGER_MODE = LoggerModes.File; // Can also be Console, Custom, or Off
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
import { OK } from 'http-status-codes';
import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';

@Controller('api/logger')
export class LoggerPracticeController {
    
    private readonly logger: Logger;
    
    constructor() {
        this.logger = new Logger();
    }

    @Get('static/console/:msg')
    private printLogsConsole(req: Request, res: Response) {
        Logger.Info(req.params.msg);
        Logger.Imp(req.params.msg);
        Logger.Warn(req.params.msg);
        Logger.Err(req.params.msg);
        Logger.Err(new Error('printing out an error'));
        Logger.Err(new Error('printing out an error full'), true); // <-- print the full Error object
        return res.status(OK).json({
            message: 'static_console_mode',
        });
    }
    
    @Get('console/:msg')
    private printLogsConsole(req: Request, res: Response) {
        this.logger.info(req.params.msg);
        this.logger.imp(req.params.msg);
        this.logger.warn(req.params.msg);
        this.logger.err(req.params.msg);
        this.logger.err(new Error('printing out an error'));
        this.logger.err(new Error('printing out an error full'), true);
        return res.status(OK).json({
            message: 'console_mode',
        });
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
one interface `ICustomLogger` which has one method `sendLog()` that needs to implemented. If you created a class
which implements this interface, and add it to Logger through a setter or the constructor, and set the mode to `CUSTOM`, 
Logger will call whatever logic you created for `sendLog()`.

````typescript
// CustomLoggerTool.ts
import { ICustomLogger } from '@overnightjs/logger';

export class CustomLoggerTool implements ICustomLogger {

    private readonly thirdPartyLoggingApplication: ThirdPartyLoggingApplication;

    constructor() {
        this.thirdPartyLoggingApplication = new ThirdPartyLoggingApplication();
    }

    // Needs to be implemented
    public sendLog(content: any, prefix: string): void {
        // prefix is either: INFO | ERROR | WARNING | IMPORTANT
        this.thirdPartyLoggingApplication.doStuff(content);
    }
}
````

````typescript
    // In the controller file
    
    ...

    @Get('useCustomLogger/:msg')
    private useCustomLogger(req: Request, res: Response) {
        const logger = new Logger(LoggerModes.CUSTOM, '', true, this.customLoggerTool);
        logger.rmTimestamp = true;
        logger.info(req.params.msg);
        return res.status(OK).json({
                    message: 'console_mode',
                });
    }
````
<br>
<br>
<br>



## <a name="overnight-jwt"></a> OvernightJS/jwt

### What is it
This is an easy tool for removing boilerplate code around json-web-tokens (jwt). You can get your token
and middleware with just one line of code. @overnightjs/core is a sister library to add TypeScript decorators 
for methods meant to call Express routes and is not required for @overnightjs/jwt but they do work beautifully 
together. 


### Features
* `JwtManager` class which, when when used statically, can pull the JWT expiration and secret from
the environment variables.
* When used as an instance-object, `JwtManager` can be dynamically passed the JWT expiration and secret
if you prefer to set them through the code.
* Default values for the secret and expiration when used statically. This is convenient for a 
development environment.
* Fully type-safe :)


### Installation
```batch
$ npm install --save @overnightjs/jwt express 
$ npm install --save-dev @types/express @types/express-jwt @types/jsonwebtoken
```

### Table of Contents
* [Option 1](#option-1)
* [Option 2](#option-2)


#### <a name="options-1"></a> Option 1: Environment Variables
This is what really saves you from having to do boilerplate code. The two environment variables you
need to set are **OVERNIGHT_JWT_SECRET** and **OVERNIGHT_JWT_EXP**. OVERNIGHT_JWT_SECRET should be a really
long, random string (recommended is 80 characters) and the rules for setting OVERNIGHT_JWT_EXP are the same as
setting the expiration time for the _jsonwebtoken_ library. The rules are:

> If you use a string be sure you provide the time units (days, hours, etc), otherwise milliseconds is used by
default ("120" is equal to "120ms"). Examples: "2 days", "10h", "7d". 

How you set your environment variables will vary depending on the which environment you are working in. 
I use Ubuntu which is pretty easy. Just open the _/etc/environment_ file and type:

> OVERNIGHT_JWT_SECRET="your super long random string" <br>
> OVERNIGHT_JWT_EXP="your expiration time"

Another common option is the `dotenv` library, which imports environment variables from a _.env_ file
<br>

If you do not set these environment variables, a default value of **'3 days'** will be set for the expiration time and a 
random string will be generated for the secret. The random string is fine for development but do not use it for 
production. Every time you restart the server the secret will change and all client-side JWTs will become invalid. 
<br>

Now let's create the controller. The data that is encrypted is stored as the `payload` property. That's all there is to it. 
Just import `JwtManager`.


````typescript
import { OK } from 'http-status-codes';
import { JwtManager, ISecureRequest } from '@overnightjs/jwt';
import { Controller, Middleware, Get, Post } from '@overnightjs/core';
import { Request, Response } from 'express';

@Controller('api/jwt')
export class JwtPracticeController {
    
    @Get(':email')
    private getJwt(req: Request, res: Response) {
        const jwtStr = JwtManager.jwt({
            email: req.params.email
        });
        return res.status(OK).json({
            jwt: jwtStr,
        });
    }

    @Post('callProtectedRoute')
    @Middleware(JwtManager.middleware)
    private callProtectedRoute(req: ISecureRequest, res: Response) {
        return res.status(OK).json({
            email: req.payload.email,
        });
    }
}
````

#### <a name="options-2"></a> Option 2: Pass through the constructor
If you want to set your secret and expiration time manually, you can instantiate the `JwtManager` class 
and set them via the constructor. I love using Option 1 way more, but I thought I'd supply this option
for people who prefer to import it another way. 

````typescript
import { OK } from 'http-status-codes';
import { JwtManager, ISecureRequest } from '@overnightjs/jwt';
import { Controller, Middleware, Get, Post } from '@overnightjs/core';
import { Request, Response } from 'express';

const jwtMgr = new JwtManager('secret', '10h');

@Controller('api/jwt')
export class JwtPracticeController {
    
    @Get('getJwtAlt/:fullname')
    private getJwtFromHandler(req: Request, res: Response) {
        const jwtStr = jwtMgr.jwt({
            fullName: req.params.fullname
        });
        return res.status(OK).json({
            jwt: jwtStr,
        });
    }

    @Post('callProtectedRouteAlt')
    @Middleware(jwtMgr.middleware)
    private callProtectedRouteFromHandler(req: ISecureRequest, res: Response) {
        return res.status(OK).json({
            fullname: req.payload.fullName,
        });
    }
}
````


#### Works just as fine in regular Express
You dont have to use `@overnightjs/jwt` with `@overnightjs/core`. If you're using Express but are not
interested in using decorators, you can pass the middleware just the same as you would for any typical 
Express Router object.

````javascript
const router = express.Router();

router.get('users', JwtManager.middleware, (req, res) => {
    console.log(req.payload.email);
})

app.use('/', router); 
````


## That's All!!
Please star this repo if you found it useful. Happy web-deving :)


## License
[MIT](LICENSE)
