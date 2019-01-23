/**
 * Examples for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import * as bodyParser from 'body-parser';
import * as controllers from './controllers/controllers';

import { Server } from '@overnightjs/core';
import { cimp } from 'simple-color-print';
import { ParentController } from './controllers/ParentController';
import MailPromise from 'mail-promise';


export class NormalRouterServer extends Server {


    constructor() {
        super();

        this.setupExpress();

        let controllers = this.setupControllers();
        super.addControllers_(controllers);
    }


    private setupExpress(): void {

        // Setup express here like you would
        // any other ExpressJS application.
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
    }


    private setupControllers(): Array<ParentController> {

        // Setup mailer object
        let mailer = new MailPromise();

        // Create a type for the 'controllers.ts' file
        type Controllers = {
            [ctrlName: string]: typeof ParentController
        };

        let ctlrInstances: any = [];

        for (let ctrlName in controllers) {
            if (controllers.hasOwnProperty(ctrlName)) {

                let Controller = (<Controllers>controllers)[ctrlName];
                let controller = new Controller();

                controller.setMailer(mailer);
                ctlrInstances.push(controller);
            }
        }

        return ctlrInstances;
    }


    public start(port?: number): void {

        this.app.get('/home', (req, res) => {
            res.send('overnightjs with standard express router started');
        });

        port = port || 3000;

        this.app.listen(port, () => {
            cimp('overnightjs with standard express router started on port:' + port);
        })
    }
}
