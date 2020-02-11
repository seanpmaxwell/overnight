import {assert} from 'chai';
import * as http from 'http';
import 'mocha';
import * as sinon from 'sinon';

import {AllHttpVerbsController, RegExpController, SimpleController} from '../test/lib/controllers';
import {port} from '../test/lib/helpers';
import TestingServer from '../test/lib/TestingServer';

let app: TestingServer;
let server: http.Server;

let spy: sinon.SinonSpy;

describe('Server', () => {
    describe('showLogs', () => {
        beforeEach(() => {
            spy = sinon.spy();
            sinon.replace(console, 'log', spy);
        });

        it('should be true if constructed with \'true\'.', async () => {
            app = new TestingServer(true);
            app.addControllers(new SimpleController());
            assert.isTrue(app.showLogs);
            assert.isTrue(spy.called);
        });

        it('should be false if constructed with \'false\'.', async () => {
            app = new TestingServer(false);
            app.addControllers(new SimpleController());
            assert.isFalse(app.showLogs);
            assert.isFalse(spy.called);
        });

        it('should be true if turned on.', async () => {
            app = new TestingServer(false);
            app.showLogs = true;
            app.addControllers(new SimpleController());
            assert.isTrue(app.showLogs);
            assert.isTrue(spy.called);
        });

        it('should be false if turned off.', async () => {
            app = new TestingServer(true);
            app.showLogs = false;
            app.addControllers(new SimpleController());
            assert.isFalse(app.showLogs);
            assert.isFalse(spy.called);
        });

        afterEach(() => {
            sinon.restore();
        });
    });

    describe('addControllers', () => {
        beforeEach(() => {
            app = new TestingServer(false);
        });

        it('should be able to add a single controller', async () => {
            app.addControllers(new SimpleController());
            server = app.start(port);
            await SimpleController.validateAll();
        });

        it('should be able to add an array of controllers of length 1', async () => {
            app.addControllers([new SimpleController()]);
            server = app.start(port);
            await SimpleController.validateAll();
        });

        it('should be able to add an array of controllers of length greater than 1', async () => {
            app.addControllers([new SimpleController(), new RegExpController(), new AllHttpVerbsController()]);
            server = app.start(port);
            await Promise.all([
                SimpleController.validateAll(),
                RegExpController.validateAll(),
            ]);
        });

        afterEach(() => {
            server.close();
        });
    });
});


