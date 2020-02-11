import * as http from 'http';
import 'mocha';

import {
    AllHttpVerbsController,
    AllVerbController,
    HeadController,
    MultipleVerbDecoratorsController, NonControllerChildController,
    RegExpController,
    SimpleController, UndecoratedPropertiesController, UnmarkedMethodController,
} from '../../test/lib/controllers';
import {port} from '../../test/lib/helpers';
import TestingServer from '../../test/lib/TestingServer';
import {assert} from 'chai';

let app: TestingServer;
let server: http.Server;

describe('Method Decorators', () => {
    describe('Verbs', () => {
        before(() => {
            app = new TestingServer(false);
            app.addControllers([
                new AllHttpVerbsController(),
                new AllVerbController(),
                new HeadController(),
                new MultipleVerbDecoratorsController(),
                new SimpleController(),
                new RegExpController(),
            ]);
            server = app.start(port);
        });

        it('should allow any HTTP verb (except @Head) as a simple decorator', async () => {
            await AllHttpVerbsController.validateAll();
        });

        it('should allow multiple HTTP verb decorators', async () => {
            await MultipleVerbDecoratorsController.validateAll();
        });

        it('should allow @All to be used for all HTTP verbs', async () => {
            await AllVerbController.validateAll();
        });

        it('should use @Head function for HEAD when declared before @Get on the same route', async () => {
            await HeadController.validateHeadBeforeGet();
        });

        it('should use @Get function (w/o body) for HEAD when declared before @Head on the same route', async () => {
            await HeadController.validateGetBeforeHead();
        });

        it('should be able to decorate properties that are functions', async () => {
            await SimpleController.validateWrapperOnProperty();
        });

        describe('Regex', () => {
            it('should allow regex for the path', async () => {
                await RegExpController.validateAll();
            });
        });

        after(() => {
            server.close();
        });
    });


    describe('Error Handling', () => {
        beforeEach(() => {
            app = new TestingServer(false);
        });

        it('should not error when there are undecorated properties in controller', async () => {
            try {
                app.addControllers([new UndecoratedPropertiesController()]);
            } catch (e) {
                assert.fail('Threw an error.');
            }
            server = app.start(port);
            await UndecoratedPropertiesController.validateUndecoratedProperties();
        });

        it('should not error when there are properties in controller that are decorated but don\'t  have a verb decorator', async () => {
            try {
                app.addControllers([new UnmarkedMethodController()]);
            } catch (e) {
                assert.fail('Threw an error.');
            }
            server = app.start(port);
            await UnmarkedMethodController.validateUnmarkedMethod();
        });

        afterEach(() => {
            server.close();
        });
    });
});
