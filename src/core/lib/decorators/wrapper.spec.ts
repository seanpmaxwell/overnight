import * as http from 'http';

import {
    OverridingClassWrapperController,
    RetypingClassWrapperController,
    TransparentClassWrapperController,
    MethodWrapperController,
} from '../../test/lib/controllers';
import {port} from '../../test/lib/helpers';
import TestingServer from '../../test/lib/TestingServer';

let app: TestingServer;
let server: http.Server;

describe('Wrapper Decorators', () => {
    describe('For Methods', () => {
        before(() => {
            app = new TestingServer(false);
            app.addControllers(new MethodWrapperController());
            server = app.start(port);
        });

        it('should not affect response when wrapper is transparent', async () => {
            await MethodWrapperController.validateTransparentWrapper();
        });

        it('should overwrite method body when wrapper ignores the input', async () => {
            await MethodWrapperController.validateOverridingWrapper();
        });

        it('should be able to wrap methods that are not of type RequestHandler', async () => {
            await MethodWrapperController.validateRetypingWrapper();
        });

        it('should be able to decorate properties that are functions', async () => {
            await MethodWrapperController.validateWrapperOnProperty();
        });

        after(() => {
            server.close();
        });
    });

    describe('For Classes', () => {
        beforeEach(() => {
            app = new TestingServer(false);
        });

        it('should not affect response when wrapper is transparent', async () => {
            app.addControllers(new TransparentClassWrapperController());
            server = app.start(port);
            await TransparentClassWrapperController.validateTransparentClassWrapper();
        });

        it('should overwrite method body when wrapper ignores the input', async () => {
            app.addControllers(new OverridingClassWrapperController());
            server = app.start(port);
            await OverridingClassWrapperController.validateOverridingClassWrapper();
        });

        it('should be able to wrap methods that are not of type RequestHandler', async () => {
            app.addControllers(new RetypingClassWrapperController());
            server = app.start(port);
            await RetypingClassWrapperController.validateRetypingClassWrapper();
        });

        afterEach(() => {
            server.close();
        });
    });


});
