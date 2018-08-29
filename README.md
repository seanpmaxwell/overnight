# OvernightJS

> TypeScript decorators for the ExpressJS Web Server! (Beta Version)


## What is it

OvernightJS is a clean simple library to add TypeScript decorators for methods meant to call Express routes.


## Features
* Define a base route using a @Controller decorator.
* Define routes on GET, POST, PUT, and DELETE verbs for methods in the controller.
* Server superclass to initialize ExpressJS server and setup controllers.
* Master repo includes sample application if you want to practice with an API calling tool such as Postman.


## Why OvernightJS

OvernightJS isn't meant to be a replacement for ExpressJS. If you're already somewhat familiar with Express, you can
learn Overnight in about 10 minutes. There are some other frameworks which do add decorators for Express such as NestJS
and TsExpressDecorators, but these are massive frameworks with entire websites dedicated to their documentation. OvernightJS
is clean, simple, and aside from the decorators, you can interact with ExpressJS in the same way you would any other Node
application. 


## Installation

You can get the latest release using npm:

```batch
$ npm install --save @overnight/core express @types/express
```

> **Important!** OvernightJS requires Node >= 6, Express >= 4, TypeScript >= 2.0 and the `experimentalDecorators`, 
`emitDecoratorMetadata`, `lib` compilation options in your `tsconfig.json` file.