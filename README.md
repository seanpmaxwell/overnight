# OvernightJS

> TypeScript decorators for the ExpressJS Web Server. (Pre-Beta Version)


## What is it

OvernightJS is a clean simple library to add TypeScript decorators for methods meant to be use in Express routes. If you
are already somewhat familiar with ExpressJS.

## Features
* Define a base route using a @Controller decorator.
* Define routes on GET, POST, PUT, and DELETE verbs.
* Server superclass to initialize ExpressJS server and add routes.
* Master repo includes sample application if you want to practice with an api calling tool such as Postman.


## Installation

You can get the latest release using npm:

```batch
$ npm install --save @overnight/core express @types/express
```

> **Important!** TsExpressDecorators requires Node >= 6, Express >= 4, TypeScript >= 2.0 and 
the `experimentalDecorators`, `emitDecoratorMetadata`, `types` and `lib` compilation 
options in your `tsconfig.json` file.