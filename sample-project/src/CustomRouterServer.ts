/**
 * Example with custom router for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import { Server } from '@overnightjs/core';

import customRouter from 'express-promise-router';
import PostController from './controllers/PostController';


class CustomRouterServer extends Server {

    private readonly START_MSG = 'overnightjs with custom router started on port:';


    constructor() {
        super();
        const postController = new PostController();
        super.addControllers(postController, customRouter);
    }


    public start(): void {
        const port = 3000;
        this.app.listen(port, () => cimp(this.START_MSG + port));
    }
}

export default CustomRouterServer;
