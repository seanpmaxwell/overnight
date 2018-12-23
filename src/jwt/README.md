# OvernightJS/jwt

> Simply the process for working with Json-Web-Tokens inside of ExpressJS routes

<img alt='overnightjs' src='https://github.com/seanpmaxwell/overnight/raw/master/overnightjs.png' border='0'>


## What is it

This is an easy tool for removing boilerplate code around json-web-tokens (jwt). You can get your token
strings and middleware with just one line of code. @overnightJS/core is a clean simple library to add 
TypeScript decorators for methods meant to call Express routes. @overnightjs/jwt does not require
@overnightjs/core but they do work beautifully together. 



## Features
* `jwt` and `jwtmiddleware` libraries which can pull the secret-string and expiration-time directly 
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
$ npm install --save-dev @types/express
```

<br>



## Table of Contents

* [Option 1](#option-1)
* [Option 2](#option-2)

<br>



## <a name="options-1"></a> Option 1:

#### Set the environment variables
This is what really saves you from having to do boilerplate code. The two environment variables you
need to set are **OVERNIGHTJWTSECRET** and **OVERNIGHTJWTEXP**. OVERNIGHTJWTSECRET should be a really
long, random string (mine is 80 characters) and the rules for setting OVERNIGHTJWTEXP are the same as
setting the expiration time for the _jsonwebtoken_ library. The rules are:

> Examples: "2 days", "10h", "7d". If you use a string be sure you provide the time units (days, hours, etc), 
otherwise milliseconds unit is used by default ("120" is equal to "120ms").

<br>

How you set you environment variables will vary depending on the which environment you are working in. 
I use Ubuntu which is pretty easy. Just open the _/etc/environment_ file and type:

> OVERNIGHTJWTSECRET="your super long random string"

> OVERNIGHTJWTEXP="your expiration time"

<br>

If you do not set these environment variables a default value of **'3 days'** will be set for the expiration
time and a random string will be generated for the secret. The random string is fine for development
but do not use it for production. Every time you restart the server the secret will change and all 
logins will become invalid. 


#### Create your controller

The data that is encrypted is stored as the `payload` property. That's all there is to it. Just import 
`jwt` and `jwtmiddleware`.


```typescript
import { Controller, Middleware, Get }       from '@overnightjs/core'
import { jwt, jwtmiddleware, SecureRequest } from '@overnightjs/jwt'
import { Request, Response }                 from 'express'


@Controller('api/jwt')
export class JwtPracticeController
{
    @Get('getjwt/:email')
    private getJwt(req: Request, res: Response): void
    {
        let jwtStr = jwt({
            email: req.params.email
        });

        res.status(200).json({jwt: jwtStr});
    }

    @Get('callProtectedRoute')
    @Middleware(jwtmiddleware)
    private callProtectedRoute(req: SecureRequest, res: Response): void
    {
        res.status(200).json({email: req.payload.email});
    }
}
```

<br>


## <a name="options-2"></a> Option 2:

If you want to set your secret and expiration time manually, you can import the `JwtHandler` class 
and set them via the constructor. I love using Option 1 way more, but I thought I'd supply this option
for people 

```typescript
import { Controller, Middleware, Get } from '@overnightjs/core'
import { JwtHandler, SecureRequest }   from '@overnightjs/jwt'
import { Request, Response }           from 'express'

const jwtHandler = new JwtHandler('secret', '10h');
const JWTMIDDLEWARE = jwtHandler.getMiddleware();


@Controller('api/jwt')
export class JwtPracticeController
{
    @Get('getjwt/:email')
    private getJwt(req: Request, res: Response): void
    {
        let jwtStr = jwtHandler.getJwt({
            email: req.params.email
        });

        res.status(200).json({jwt: jwtStr});
    }

    @Get('callProtectedRoute')
    @Middleware(JWTMIDDLEWARE)
    private callProtectedRoute(req: SecureRequest, res: Response): void
    {
        res.status(200).json({email: req.payload.email});
    }
}
```


#### Works just as fine in regular Express

You dont have to use `@overnightjs/jwt` with `@overnightjs/core`. If you're using Express but not
interested in using decorators, you can pass the middleware just the same as you would for any typical 
Express Router object.

```javascript

var router = express.Router()

router.get('users', ['jwtmiddleware directly or from handler'], (req, res) => {
    console.log(req.payload.email)
})

app.use('api', router)

```