/**
 * Example with custom router for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import { Server } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import customRouter from 'express-promise-router';
import CustomRouterController from './controllers/CustomRouterController';


class CustomRouterServer extends Server {

    private readonly START_MSG = 'OvernightJs with custom router started on port:';


    constructor() {
        super();
        super.addControllers(new CustomRouterController(), customRouter);
    }


    public start(port?: number): void {
        this.app.listen(port, () => {
            Logger.Imp(this.START_MSG + port);
        });
    }
}

export default CustomRouterServer;
