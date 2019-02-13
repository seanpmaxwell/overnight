/**
 * Examples for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import * as bodyParser from 'body-parser';
import * as controllers from './ctlrExport';
import { Server } from '@overnightjs/core';
import { cimp } from 'simple-color-print';


class NormalRouterServer extends Server {


    constructor(setupCtlrsMethod?: string) {
        super();

        // Setup JSON parse middleware
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));

        // Setup Controllers
        if (!setupCtlrsMethod || setupCtlrsMethod === 'auto' ) {
            super.addControllers();
        } else if (setupCtlrsMethod === 'manual') {
            this.setupControllersManually();
        } else if (setupCtlrsMethod === 'dir') {
            super.addControllers('controllers');
        }
    }


    private setupControllersManually(): void {

        const ctlrInstances = [];

        for (const ctrlName in controllers) {
            if (controllers.hasOwnProperty(ctrlName)) {
                const Controller = (controllers as any)[ctrlName];
                ctlrInstances.push(new Controller());
            }
        }

        super.addControllers(ctlrInstances);
    }


    public start(port?: number): void {

        port = port || 3000;

        this.app.get('*', (req, res) => {
            res.send('overnightjs with standard express router started');
        });

        this.app.listen(port, () => {
            cimp('overnightjs with standard express router started on port:' + port);
        })
    }
}

export default NormalRouterServer;
