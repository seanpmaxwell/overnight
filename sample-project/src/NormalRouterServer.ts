/**
 * Examples for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import * as bodyParser from 'body-parser';
import * as controllers from './controllers';
import { Server } from '@overnightjs/core';
import { cimp } from 'simple-color-print';


class NormalRouterServer extends Server {

    private readonly _FRONT_END_MSG = 'overnightjs with standard express router started';
    private readonly _START_MSG = 'overnightjs with standard express router started on port:';


    constructor() {
        super();

        // Setup JSON parse middleware
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));

        this.setupControllers();
    }


    private setupControllers(): void {

        const ctlrs: any = {...controllers};
        const ctlrInstances = [];

        for (const name in ctlrs) {
            if (controllers.hasOwnProperty(name) && typeof ctlrs[name] === 'function') {
                ctlrInstances.push(new ctlrs[name]());
            }
        }

        super.addControllers(ctlrInstances);
    }


    public start(port?: number): void {

        port = port || 3000;

        this.app.get('*', (req, res) => res.send(this._FRONT_END_MSG));

        this.app.listen(port, () => cimp(this._START_MSG + port));
    }
}

export default NormalRouterServer;
