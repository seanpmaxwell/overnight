/**
 * Example with custom router for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import * as customRouter  from 'express-promise-router'
import { Server }         from '@overnightjs/core'
import { cimp }           from 'simple-color-print'
import { PostController } from './controllers/PostController'


export class CustomRouterServer extends Server
{
    constructor()
    {
        super()

        // Setup the controller
        let postController = new PostController()

        super.addControllers_(postController, customRouter)
    }

    public start(port?: number)
    {
        port = port ? port : 3000

        this.app_.listen(port, () => {
            cimp('overnightjs with custom router started on port:' + port)
        })
    }
}
