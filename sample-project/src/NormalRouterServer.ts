/**
 * Examples for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import * as bodyParser from 'body-parser';
import * as controllers from './controllers';
import { Server } from '@overnightjs/core';


class NormalRouterServer extends Server {

    private readonly FRONT_END_MSG = 'overnightjs with standard express router started';
    private readonly START_MSG = 'overnightjs with standard express router started on port:';


    constructor() {
        super();

        // Setup JSON parse middleware
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));

        this.setupControllers();
    }


    private setupControllers(): void {

        const controllerInstances = [];

        for (const name in controllers) {
            const Controller = (controllers as any)[name];
            if (controllers.hasOwnProperty(name) && typeof Controller === 'function') {
                controllerInstances.push(new Controller());
            }
        }

        super.addControllers(controllerInstances);
    }


    public start(port?: number): void {
        port = port || 3000;
        this.app.get('*', (req, res) => res.send(this.FRONT_END_MSG));
        this.app.listen(port, () => cimp(this.START_MSG + port));
    }
}

export default NormalRouterServer;
