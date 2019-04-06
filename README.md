# OvernightJS

> TypeScript decorators for the ExpressJS Web Server!

<img alt='overnightjs' src='https://github.com/seanpmaxwell/overnight/raw/master/overnightjs.png' border='0'>
 

## What is it
OvernightJS is a clean simple library to add TypeScript decorators for methods meant to call Express routes. It also
includes a library for managing json-web-tokens. 


## Features
* Define a base route using a @Controller decorator.
* Define routes on GET, POST, PUT, and DELETE verbs for methods in the controller.
* Decorator for Express Router Middleware 
* Server superclass to initialize ExpressJS server and setup controllers.
* Json-Web-Token management software
* Master repo includes sample application if you want to practice with an API calling tool such as Postman.
* Allows for adding your own custom Router classes if you don't want to use the standard express Router
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

<br>


## Installation
You can get the latest release using npm:

```batch
$ npm install --save @overnightjs/core express 
$ npm install --save-dev @types/express
```

> **Important!** OvernightJS requires Node >= 6, Express >= 4, TypeScript >= 2.0 and the `experimentalDecorators`, 
`lib` compilation options in your `tsconfig.json` file.


<br>


## <a name="overnight-core"></a> Quick start

#### Create your controller

```typescript
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
   
}
```

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
call it after setting up your middleware. You can pass `super.addControllers()` a single controller 
instance or an array of controller instances.
<br>

```typescript
import * as bodyParser from 'body-parser';
import { Server } from '@overnightjs/core';
import { cinfo, cimp } from 'simple-color-print';
import { UserController } from './UserController';
import { SignupController } from './SignupController';


export class SampleServer extends Server {
    
    constructor() {
        super();
        
        this.setupExpress();
        this.setupControllers();
    }

    private setupExpress(): void {
        
        // Setup express here like you would
        // any other ExpressJS application.
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
    }

    private setupControllers(): Array<CustomController> {
        
        let userController = new UserController();
        let signupController = new SignupController();
        
        let dbConnObj = new SomeDbConnClass('credentials');
        signupController.setDbConn(dbConnObj);
        userController.setDbConn(dbConnObj);

        // This must be called, and can be passed a single controller or an 
        // array of controllers. Optional router object can also be passed 
        // as second argument.
        super.addControllers([userController, signupController]);
    }

    public start(port: number): void {
        
        this.app.listen(port, () => {
            cimp('Server listening on port:' + port);
        })
    }
}
```
<br>


#### See how awesome this is!
Without the above decorators we would have to wrap each controller method with something like:

```typescript
/* In the controller file*/
public getRoutes(): Router {
    
    let router = Router();
    
    router.get('/', jwtMiddleWare, (req, res) => {
        this.getAll(<SecureRequest>req, res);
    });
    
    // Repeat for every single controller method
    
    return router;
}


/* Somewhere in the server file*/

this.app.use('/api/users', userController.getRoutes());
// repeat for every single controller class
```

This would get really tedious overtime and lead to a lot of boiler plate code.

<br>


## <a name="custom-router"></a> Using a Custom Router
Suppose you don't want to use the built in "Router" object which is provided by express. Maybe you
don't like using async/await or having to call `.catch()` if you're not using try/catch blocks. Maybe
you're using a library like _express-promise-router_ to handle the route callbacks. OvernightJS allows
you to pass in a custom router object in the `super.addControllers()` method. Simply pass in your
custom router object as the second argument after the controller/s. When you don't specify a custom
router, the default express.Router() object is used. 


- Controller using _express-promise-router_:

```typescript
import { Request, Response } from 'express';
import { Controller, Get, Put } from '@overnightjs/core';


@Controller('api/posts')
export class PostController {
    
    private readonly _INVALID_MSG = 'You entered an invalid post id: ';
    private readonly _VALID_MSG = 'You entered the post id: ';

    @Get(':id')
    private get(req: Request, res: Response): Promise<Response> {
        return this.someAsyncFunction(req.params.id)
                    .then(ret => res.status(200).json({msg: ret}));
    }

    private someAsyncFunction(id: number): Promise<string> {
        return new Promise((res, rej) => {
            isNaN(id) ? rej(this._INVALID_MSG + id) : res(this._VALID_MSG + id);
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
```

- Add _express-promise-router_ in the `super.addControllers()` method:


```typescript
/**
 * Example with custom router for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import * as customRouter  from 'express-promise-router';
import { Server } from '@overnightjs/core';
import { PostController } from './controllers/PostController';


export class CustomRouterServer extends Server {
    
    private readonly _START_MSG = 'overnightjs with custom router started on port: ';
    
    constructor() {
        super();
        let postController = new PostController();
        super.addControllers(postController, customRouter);
    }

    public start(port: number): void {
        this.app.listen(port, () => {
            console.log(this._START_MSG + port);
        })
    }
}
```
<br>
<br>
<br>




## <a name="overnight-jwt"></a> OvernightJS/jwt

## What is it
This is an easy tool for removing boilerplate code around json-web-tokens (jwt). You can get your token
strings and middleware with just one line of code. @overnightJS/core is a sister library to add 
TypeScript decorators for methods meant to call Express routes. @overnightjs/jwt does not require
@overnightjs/core but they do work beautifully together. 



## Features
* `jwt` and `jwtmiddleware` functions which can pull the secret-string and expiration-time directly 
from the environment variables.
* `JwtHandler` class which can be passed a secret and expiration time if you wish to set those from
your code instead of the environment variables. 
* Default values for the secret and expiration. Which is convenient for a development environment.
* SecureRequest ExpressJS router object. 
* Fully type-safe :)

<br>



## Installation
You can get the latest release using npm:

```batch
$ npm install --save @overnightjs/jwt express 
$ npm install --save-dev @types/express @types/express-jwt @types/jsonwebtoken
```

<br>



## Table of Contents

* [Option 1](#option-1)
* [Option 2](#option-2)

<br>



## <a name="options-1"></a> Option 1:

#### Set the environment variables
This is what really saves you from having to do boilerplate code. The two environment variables you
need to set are **OVERNIGHT_JWT_SECRET** and **OVERNIGHT_JWT_EXP**. OVERNIGHT_JWT_SECRET should be a really
long, random string (recommended is 80 characters) and the rules for setting OVERNIGHT_JWT_EXP are the same as
setting the expiration time for the _jsonwebtoken_ library. The rules are:

> If you use a string be sure you provide the time units (days, hours, etc), otherwise milliseconds is used by
default ("120" is equal to "120ms"). Examples: "2 days", "10h", "7d". 

<br>

How you set your environment variables will vary depending on the which environment you are working in. 
I use Ubuntu which is pretty easy. Just open the _/etc/environment_ file and type:

> OVERNIGHT_JWT_SECRET="your super long random string"
> OVERNIGHT_JWT_EXP="your expiration time"

Another common option is the `dotenv` library, which imports environment variables from a .env file

<br>

If you do not set these environment variables, a default value of **'3 days'** will be set for the expiration time and a 
random string will be generated for the secret. The random string is fine for development but do not use it for 
production. Every time you restart the server the secret will change and all client-side jwts will become invalid. 


#### Create your controller

The data that is encrypted is stored as the `payload` property. That's all there is to it. Just import 
`jwt` and `jwtmiddleware`.


```typescript
import { Controller, Middleware, Get } from '@overnightjs/core';
import { jwt, jwtmiddleware, SecureRequest } from '@overnightjs/jwt';
import { Request, Response } from 'express';


@Controller('api/jwt')
export class JwtPracticeController {
    
    @Get('getjwt/:email')
    private getJwt(req: Request, res: Response): void {
        
        let jwtStr = jwt({
            email: req.params.email
        });

        res.status(200).json({jwt: jwtStr});
    }

    @Get('callProtectedRoute')
    @Middleware(jwtmiddleware)
    private callProtectedRoute(req: SecureRequest, res: Response): void {
        res.status(200).json({email: req.payload.email});
    }
}
```

<br>


## <a name="options-2"></a> Option 2:

If you want to set your secret and expiration time manually, you can import the `JwtHandler` class 
and set them via the constructor. I love using Option 1 way more, but I thought I'd supply this option
for people who prefer to import it another way. 

```typescript
import { Controller, Middleware, Get } from '@overnightjs/core';
import { JwtHandler, SecureRequest } from '@overnightjs/jwt';
import { Request, Response } from 'express';

const jwtHandler = new JwtHandler('secret', '10h');
const JWTMIDDLEWARE = jwtHandler.getMiddleware();


@Controller('api/jwt')
export class JwtPracticeController {
    
    @Get('getjwt/:email')
    private getJwt(req: Request, res: Response): void {
        
        let jwtStr = jwtHandler.getJwt({
            email: req.params.email
        });

        res.status(200).json({jwt: jwtStr});
    }

    @Get('callProtectedRoute')
    @Middleware(JWTMIDDLEWARE)
    private callProtectedRoute(req: SecureRequest, res: Response): void {
        res.status(200).json({email: req.payload.email});
    }
}
```


#### Works just as fine in regular Express

You dont have to use `@overnightjs/jwt` with `@overnightjs/core`. If you're using Express but are not
interested in using decorators, you can pass the middleware just the same as you would for any typical 
Express Router object.

```javascript
var router = express.Router();

router.get('users', ['jwtmiddleware directly or from handler'], (req, res) => {
    console.log(req.payload.email);
})

app.use('api', router); 
```
<br>
<br>
<br>


## <a name="overnight-logger"></a> OvernightJS/logger



<br>
<br>

## That's All!!

Please star this repo if you found it useful. Happy web-deving :)
