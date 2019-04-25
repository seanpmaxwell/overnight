/**
 * Example with custom router for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import { Server } from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";
import customRouter from "express-promise-router";
import PostController from "./controllers/PostController";


class CustomRouterServer extends Server {

    private readonly START_MSG = "OvernightJs with custom router started on port:";
    private readonly logger: Logger;


    constructor() {
        super();
        this.logger = new Logger();
        const postController = new PostController();
        super.addControllers(postController, customRouter);
    }


    public start(): void {
        const port = 3000;

        this.app.listen(port, () => {
            this.logger.imp(this.START_MSG + port);
        });
    }
}

export default CustomRouterServer;
