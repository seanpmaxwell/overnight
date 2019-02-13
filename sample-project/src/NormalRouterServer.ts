/**
 * Examples for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import * as bodyParser from 'body-parser';
import * as controllers from './controllers/controllers';

import { Server } from '@overnightjs/core';
import { cimp } from 'simple-color-print';

import ParentController from './controllers/ParentController';
import MailPromise from 'mail-promise';


type Controllers = {
    [ctrlName: string]: typeof ParentController
};

class NormalRouterServer extends Server {


    constructor(setupCtlrsMethod?: string) {
        super();

        // Setup JSON parse middleware
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));

        // Setup APIs
        if (!setupCtlrsMethod || setupCtlrsMethod === 'auto' ) {
            super.addControllers();
        } else if (setupCtlrsMethod === 'manually') {
            this.setupControllersManually();
        } else if (setupCtlrsMethod === 'dir') {
            super.addControllers('controllers');
        }
    }


    private setupControllersManually(): void {

        let mailer = new MailPromise();
        let ctlrInstances = [];

        for (let ctrlName in controllers) {
            if (controllers.hasOwnProperty(ctrlName)) {

                let Controller = (<Controllers>controllers)[ctrlName];
                let controller = new Controller();

                controller.setMailer(mailer);
                ctlrInstances.push(controller);
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
