import * as http from 'http';

import {
    ArrayOfClassErrorMiddlewareController,
    ArrayOfClassMiddlewareController, ArrayOfSingleClassErrorMiddlewareController,
    ArrayOfSingleClassMiddlewareController, MethodErrorMiddlewareController,
    MethodMiddlewareController, SingleClassErrorMiddlewareController,
    SingleClassMiddlewareController,
} from '../../test/lib/controllers';
import {port} from '../../test/lib/helpers';
import TestingServer from '../../test/lib/TestingServer';

let app: TestingServer;
let server: http.Server;

describe('Middleware Decorators', () => {
    describe('For Methods', () => {
        before(() => {
            app = new TestingServer(false);
            app.addControllers(new MethodMiddlewareController());
            server = app.start(port);
        });

        it('should be able to add a single middleware', async () => {
            await MethodMiddlewareController.validateAddSingleMiddleware();
        });

        it('should be able to add an array of middleware of length 1', async () => {
            await MethodMiddlewareController.validateAddArrayOfMiddlewareOfLength1();
        });

        it('should be able to add an array of middleware of length greater than 1', async () => {
            await MethodMiddlewareController.validateAddArrayOfMiddleware();
        });

        it('should be able to decorate properties that are functions', async () => {
            await MethodMiddlewareController.validateMiddlewareOnProperty();
        });

        after(() => {
            server.close();
        });
    });

    describe('For Classes', () => {
        beforeEach(() => {
            app = new TestingServer(false);
        });

        it('should be able to add a single middleware', async () => {
            app.addControllers(new SingleClassMiddlewareController());
            server = app.start(port);
            await SingleClassMiddlewareController.validateAddSingleClassMiddleware();
        });

        it('should be able to add an array of middleware of length 1', async () => {
            app.addControllers(new ArrayOfSingleClassMiddlewareController());
            server = app.start(port);
            await ArrayOfSingleClassMiddlewareController.validateAddArrayOfSingleClassMiddleware();
        });

        it('should be able to add an array of middleware of length greater than 1', async () => {
            app.addControllers(new ArrayOfClassMiddlewareController());
            server = app.start(port);
            await ArrayOfClassMiddlewareController.validateAddArrayOfClassMiddleware();
        });

        afterEach(() => {
            server.close();
        });
    });
});



describe('Error Middleware Decorators', () => {
    describe('For Methods', () => {
        before(() => {
            app = new TestingServer(false);
            app.addControllers(new MethodErrorMiddlewareController());
            server = app.start(port);
        });

        it('should be able to add a single error middleware', async () => {
            await MethodErrorMiddlewareController.validateAddSingleErrorMiddleware();
        });

        // it('should be able to add an array of error middleware of length 1', async () => {
        //     await MethodErrorMiddlewareController.validate();
        // });
        //
        // it('should be able to add an array of error middleware of length greater than 1', async () => {
        //     await MethodErrorMiddlewareController.validate();
        // });

        it('should be able to decorate properties that are functions', async () => {
            await MethodErrorMiddlewareController.validateErrorMiddlewareOnProperty();
        });

        after(() => {
            server.close();
        });
    });

    describe('For Classes', () => {
        beforeEach(() => {
            app = new TestingServer(false);
        });

        it('should be able to add a single error middleware', async () => {
            app.addControllers(new SingleClassErrorMiddlewareController());
            server = app.start(port);
            await SingleClassErrorMiddlewareController.validateAddSingleErrorMiddleware();
        });

        it('should be able to add an array of error middleware of length 1', async () => {
            app.addControllers(new ArrayOfSingleClassErrorMiddlewareController());
            server = app.start(port);
            await ArrayOfSingleClassErrorMiddlewareController.validateAddArrayOfClassErrorMiddlewareOfLength1();
        });

        it('should be able to add an array of error middleware of length greater than 1', async () => {
            app.addControllers(new ArrayOfClassErrorMiddlewareController());
            server = app.start(port);
            await ArrayOfClassErrorMiddlewareController.validateAddArrayOfClassErrorMiddleware();
        });

        afterEach(() => {
            server.close();
        });
    });
});
