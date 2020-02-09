/**
 * Testing Server
 *
 * created by Joey Kilpatrick 2/6/2020
 */

import * as bodyParser from 'body-parser';
import { Request, Response } from 'express';
import * as http from 'http';
import {NOT_FOUND} from 'http-status-codes';

import {port as defaultPort} from './helpers';
import { Server } from '../../lib';


class TestingServer extends Server {


    constructor(showLogs: boolean) {
        super(showLogs);
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
    }


    public start(port?: number): http.Server {
        port = port || defaultPort;
        this.app.get('/*', (req: Request, res: Response) => {
            return res.status(NOT_FOUND).send();
        });
        return this.app.listen(port);
    }
}

export default TestingServer;
