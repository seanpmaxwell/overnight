# OvernightJS/core

> TypeScript decorators for the ExpressJS Web Server!

<img alt='overnightjs' src='https://github.com/seanpmaxwell/overnight/raw/master/overnightjs.png' border='0'>
 

## What is it
OvernightJS is a simple library to add TypeScript decorators for methods meant to call Express routes. It also
includes a package for managing json-web-tokens and showing logs. 


## Features
* Define a base route using a @Controller decorator.
* @Get, @Post, @Put, and @Delete decorators to convert controller methods into Express routes.
* @Middleware decorator.
* Decorators also work with arrow functions set as class properties.
* Server superclass to initialize ExpressJS server and setup controllers.
* Json-Web-Token management.
* Easy to configure logging tool.
* Master repo includes a sample application, if you want to practice with an API calling tool such as Postman.
* Allows for adding your own custom Router classes if you don't want to use the standard express Router.
* Compatible when transpiling to either es5 or es6.
* Fully type safe :)


## Why OvernightJS
OvernightJS isn't meant to be a replacement for Express. If you're already somewhat familiar with ExpressJS, you can
learn Overnight in about 10 minutes. There are some other frameworks which do add decorators for Express such as NestJS
and TsExpressDecorators, but these are massive frameworks with entire websites dedicated to their documentation. OvernightJS
is clean, simple, and aside from the decorators, you can interact with ExpressJS in the same way you would any other Node
application.


## Table of Contents
* [OvernightJS/core](#overnight-core)
* [Custom Router](#custom-router)
* [OvernightJS/jwt](#overnight-jwt)
* [OvernightJS/logger](#overnight-logger)


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
import { Request, Response, NextFunction } from 'express';
import { Controller, Get, Post, Put, Delete, Middleware } from '@overnightjs/core';


@Controller('api/users')
export class UserController {
    
    
    @Get(':id')
    get(req: Request, res: Response): any {
        console.log(req.params.id);
        return res.status(200).json({msg: 'get_called'});
    }
    

    @Get()
    @Middleware(middleware)
    private getAll(req: Request, res: Response): void {
        res.status(200).json({msg: 'get_all_called'});
    }


    @Post()
    private add(req: Request, res: Response): void {
        res.status(200).json({msg: 'add_called'});
    }


    @Put('update-user')
    @Middleware([middleware1, middleware2])
    private update(req: Request, res: Response): void {
        res.status(200).json({msg: 'update_called'});
    }


    // Next param is optional
    @Delete('delete/:id')
    private delete(req: Request, res: Response, next: NextFunction): void {
        res.status(200).json({msg: 'delete_called'});
    }


    // async/await work normally :)
    @Get('practice/async')
    private async getWithAsync(req: Request, res: Response): Promise<void> {
        let msg;
        try {
            msg = await this.someMethodWhichReturnsAPromise(req);
        } catch (err) {
            msg = err;
        } finally {
            res.status(200).json({msg: msg});
        }
    }
    
    
    // You don't have to use class methods, you can also use properties whose value is arrow function.
    // You will have to cast Overnight to the 'any' type to avoid type errors though and import
    // it at the top of your file like this 'import * as OvernightJS from 'overnightjs/core'
    @(OvernightJS as any).Get('arrow/:id')
    private get = (req: Request, res: Response) => {
        this.logger.info(req.params.id);
        return res.status(200).json({msg: 'get_arrow_called'});
    }
}
````

#### Import your controller into the server
OvernightJS provides a Server superclass which initializes a new ExpressJS application. The express 
object is accessed using `this.app`, which is a protected, readonly class variable. You can interact 
with this variable like you would any normal express Application created with `require('express')()`. 
The reason the controllers are not imported and setup for you automatically is the server is meant to 
be a place where you hook everything together. Suppose for example that you want to add the same database 
connection instance to several of your controllers at once. This setup let's you do that before 
initializing all of your controller routes.
<br>

`super.addControllers()` must be called to enable all of the routes in your controller. Make sure to
call it after setting up your middleware. You can pass `super.addControllers()` a single controller-instance 
or an array of controller-instances.
<br>

````typescript
import * as bodyParser from 'body-parser';
import { Server } from '@overnightjs/core';
import { UserController } from './UserController';
import { SignupController } from './SignupController';


export class SampleServer extends Server {
    
    
    constructor() {
        super();
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
        // This must be called, and can be passed a single controller or an array of 
        // controllers. Optional router object can also be passed as second argument.
        super.addControllers([userController, signupController]);
    }


    public start(port: number): void {
        this.app.listen(port, () => {
            cimp('Server listening on port: ' + port);
        })
    }
}
````


#### See how awesome this is!
Without the above decorators we would have to wrap each controller method with something like:

````typescript
/* In the controller file*/
class UserController {
    
    public getRoutes(): Router {
        const router = Router();
        router.get('/', your middleware, (req, res) => {
            // Do some stuff in here
        });
        router.get('/anotherRoute', your middleware, (req, res) => {
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
<br>
<br>
<br>




## <a name="custom-router"></a> Using a Custom Router
Suppose you don't want to use the built in "Router" object which is provided by Express. Maybe you
don't like using async/await or having to call `.catch()` if you're not using `try/catch` blocks. Maybe
you're using a library like _express-promise-router_ to handle the route callbacks. OvernightJS allows
you to pass in a custom router object in the `super.addControllers()` method. Simply pass in your
custom router as the second param after the controller-instance/s. When you don't specify a custom
router, the default express.Router() object is used. 


- Controller using _express-promise-router_:
````typescript
import { Request, Response } from 'express';
import { Controller, Get, Put } from '@overnightjs/core';


@Controller('api/posts')
export class PostController {
    
    private readonly INVALID_MSG = 'You entered an invalid post id: ';
    private readonly VALID_MSG = 'You entered the post id: ';
    

    @Get(':id')
    private get(req: Request, res: Response): Promise<Response> {
        return this.someAsyncFunction(req.params.id)
                    .then(ret => res.status(200).json({msg: ret}));
    }


    private someAsyncFunction(id: number): Promise<string> {
        return new Promise((res, rej) => {
            isNaN(id) ? rej(this.INVALID_MSG + id) : res(this.VALID_MSG + id);
        })
    }


    @Put(':id')
    private add(req: Request, res: Response): Promise<string> {
        return Promise.resolve('next');
    }


    @Put('foo')
    private add2(req: Request, res: Response): void {
        res.status(200).json({msg: 'Route used: ' + req.url});
    }
}
````

- Add _express-promise-router_ in the `super.addControllers()` method:
````typescript
import * as customRouter  from 'express-promise-router';
import { Server } from '@overnightjs/core';
import { PostController } from './controllers/PostController';


export class CustomRouterServer extends Server {
    
    private readonly START_MSG = 'OvernightJS with custom router started on port: ';
    
    
    constructor() {
        super();
        const postController = new PostController();
        super.addControllers(postController, customRouter);
    }


    public start(port: number): void {
        this.app.listen(port, () => {
            console.log(this.START_MSG + port);
        })
    }
}
````
<br>
<br>
<br>

## That's All!!
Please star this repo if you found it useful. Happy web-deving :)
