# <a name="overnight-jwt"></a> OvernightJS/jwt

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
import { JwtManager, SecureRequest } from '@overnightjs/jwt';
import { Controller, Middleware, Get, Post } from '@overnightjs/core';
import { Request, Response } from 'express';

@Controller('api/jwt')
export class JwtPracticeController {
    
    @Get(':email')
    private getJwt(req: Request, res: Response): void {

        const jwtStr = JwtManager.jwt({
            email: req.params.email
        });

        res.status(200).json({jwt: jwtStr});
    }

    @Post('callProtectedRoute')
    @Middleware(JwtManager.middleware)
    private callProtectedRoute(req: SecureRequest, res: Response): void {
        res.status(200).json({email: req.payload.email});
    }
}
````

#### <a name="options-2"></a> Option 2: Pass through the constructor
If you want to set your secret and expiration time manually, you can instantiate the `JwtManager` class 
and set them via the constructor. I love using Option 1 way more, but I thought I'd supply this option
for people who prefer to import it another way. 

````typescript
import { JwtManager, SecureRequest } from '@overnightjs/jwt';
import { Controller, Middleware, Get, Post } from '@overnightjs/core';
import { Request, Response } from 'express';

const jwtMgr = new JwtManager('secret', '10h');


@Controller('api/jwt')
export class JwtPracticeController {
    
    @Get('getJwtAlt/:fullname')
    private getJwtFromHandler(req: Request, res: Response): void {

        const jwtStr = jwtMgr.jwt({
            fullName: req.params.fullname
        });

        res.status(200).json({jwt: jwtStr});
    }


    @Post('callProtectedRouteAlt')
    @Middleware(jwtMgr.middleware)
    private callProtectedRouteFromHandler(req: SecureRequest, res: Response): void {
        res.status(200).json({fullname: req.payload.fullName});
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

<br>
<br>
<br>

## That's All!!
Please star this repo if you found it useful. Happy web-deving :)
