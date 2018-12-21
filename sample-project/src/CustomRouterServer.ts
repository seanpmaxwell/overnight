/**
 * Example with custom router for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import customRouter       from 'express-promise-router'
import { Server }         from '@overnightjs/core'
import { cimp }           from 'simple-color-print'
import { PostController } from './controllers/PostController'


export class CustomRouterServer extends Server
{
    private readonly _START_MSG = 'overnightjs with custom router started on port:'

    constructor()
    {
        super();
        let postController = new PostController();
        super.addControllers_(postController, customRouter);
    }

    public start(port?: number)
    {
        this.app_.listen(port || 3000, () => {
            cimp(this._START_MSG + port);
        })
    }
}
