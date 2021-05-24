# OvernightJS

:warning: __OvernightJS/logger and OvernightJS/jwt are deprecated. For logging please see jet-logger.__

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



## Installation
You can get the latest release using npm:

```batch
$ npm install --save @overnightjs/core express 
$ npm install --save-dev @types/express
```

> **Important!** OvernightJS requires Node >= 6, Express >= 4, TypeScript >= 2.0 and the `experimentalDecorators`, 
`lib` compilation options in your `tsconfig.json` file.


## Quick start

#### Create your controller

````typescript
import { OK, BAD_REQUEST } from 'http-status-codes';
import { Controller, Middleware, Get, Post, Put, Delete } from '@overnightjs/core';
import { Request, Response } from 'express';
import Logger from 'jet-logger';

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
import Logger from 'jet-logger';
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


## That's All!!
Please star this repo if you found it useful. Happy web-deving :)


## License
[MIT](LICENSE)
