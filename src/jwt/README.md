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
$ npm install --save @overnightjs/core express 
$ npm install --save-dev @types/express
```

<br>


## Quick start: Option 1

#### Set the environment variables
This is 


#### Create your controller

Thats all there is to it. Just import `jwt` and `jwtmiddleware`.


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
        let dataToEncypt = {
            email: req.params.email
        }

        res.status(200).json({jwt: jwt(dataToEncypt)})
    }

    @Get('callProtectedRoute')
    @Middleware(jwtmiddleware)
    private callProtectedRoute(req: SecureRequest, res: Response): void
    {
        res.status(200).json({email: req.payload.email})
    }
}
```