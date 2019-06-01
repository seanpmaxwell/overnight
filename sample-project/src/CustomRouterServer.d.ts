import { Server } from '@overnightjs/core';
declare class CustomRouterServer extends Server {
    private readonly START_MSG;
    constructor();
    start(port?: number): void;
}
export default CustomRouterServer;
