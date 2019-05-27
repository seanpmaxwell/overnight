import { Server } from '@overnightjs/core';
declare class CustomRouterServer extends Server {
    private readonly START_MSG;
    private readonly logger;
    constructor();
    start(port?: number): void;
}
export default CustomRouterServer;
