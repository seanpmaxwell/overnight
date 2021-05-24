import {assert} from 'chai';
import * as http from 'http';
import 'mocha';

import {
    CaseInsensitiveController,
    CaseSensitiveController, NonControllerChildController,
    ParentOfArrayOfChildControllers,
    ParentOfArrayOfChildren,
    ParentOfArrayOfSingleChild,
    ParentOfArrayOfSingleChildController, ParentOfMultipleChildControllerDecorators, ParentOfMultipleChildrenDecorators,
    ParentOfSingleChild,
    ParentOfSingleChildController, UndecoratedClass, UnmarkedClass,
} from '../../test/lib/controllers';
import {port} from '../../test/lib/helpers';
import TestingServer from '../../test/lib/TestingServer';

let app: TestingServer;
let server: http.Server;

describe('Class Decorators', () => {

    describe('For Class Options', () => {
        beforeEach(() => {
            app = new TestingServer(false);
        });

        it('should be able to make route case-insensitive', async () => {
            app.addControllers(new CaseInsensitiveController());
            server = app.start(port);
            await CaseInsensitiveController.validateAll();
        });

        it('should be able to make route case-sensitive', async () => {
            app.addControllers(new CaseSensitiveController());
            server = app.start(port);
            await CaseSensitiveController.validateAll();
        });

        afterEach(() => {
            server.close();
        });
    });

    describe('For Children (DEPRECATED)', () => {
        beforeEach(() => {
            app = new TestingServer(false);
        });

        it('should be able to add a single child', async () => {
            app.addControllers(new ParentOfSingleChild());
            server = app.start(port);
            await ParentOfSingleChild.validateAll();
        });

        it('should be able to add an array of children of length 1', async () => {
            app.addControllers([new ParentOfArrayOfSingleChild()]);
            server = app.start(port);
            await ParentOfArrayOfSingleChild.validateAll();
        });

        it('should be able to add an array of children of length greater than 1', async () => {
            app.addControllers([new ParentOfArrayOfChildren()]);
            server = app.start(port);
            await ParentOfArrayOfChildren.validateAll();
        });

        it('should be able to be used multiple times', async () => {
            app.addControllers([new ParentOfMultipleChildrenDecorators()]);
            server = app.start(port);
            await ParentOfMultipleChildrenDecorators.validateAll();
        });

        afterEach(() => {
            server.close();
        });
    });

    describe('For Child Controllers', () => {
        beforeEach(() => {
            app = new TestingServer(false);
        });

        it('should be able to add a single child controller', async () => {
            app.addControllers(new ParentOfSingleChildController());
            server = app.start(port);
            await ParentOfSingleChildController.validateAll();
        });

        it('should be able to add an array of child controllers of length 1', async () => {
            app.addControllers([new ParentOfArrayOfSingleChildController()]);
            server = app.start(port);
            await ParentOfArrayOfSingleChildController.validateAll();
        });

        it('should be able to add an array of child controllers of length greater than 1', async () => {
            app.addControllers([new ParentOfArrayOfChildControllers()]);
            server = app.start(port);
            await ParentOfArrayOfChildControllers.validateAll();
        });

        it('should be able to be used multiple times', async () => {
            app.addControllers([new ParentOfMultipleChildControllerDecorators()]);
            server = app.start(port);
            await ParentOfMultipleChildControllerDecorators.validateAll();
        });

        afterEach(() => {
            server.close();
        });
    });



    describe('Error Handling', () => {
        beforeEach(() => {
            app = new TestingServer(false);
        });

        it('should not error when given non-controllers to add', async () => {
            app = new TestingServer(false);
            try {
                // tslint:disable-next-line:no-empty
                app.addControllers(['', 1, Symbol(), {}, (): void => {}]);
            } catch (e) {
                assert.fail('Threw an error.');
            }
            server = app.start(port);
            server.close();
        });

        it('should not error when given non-controller children', async () => {
            try {
                app.addControllers([new NonControllerChildController()]);
            } catch (e) {
                assert.fail('Threw an error.');
            }
            server = app.start(port);
            await NonControllerChildController.validateBadChildren();
        });

        it('should not error when given a class that does is not decorated with @Controller', async () => {
            try {
                app.addControllers([new UndecoratedClass()]);
            } catch (e) {
                assert.fail('Threw an error.');
            }
            server = app.start(port);
            await UndecoratedClass.validateUndecoratedClass();
        });

        it('should not error when given a class that does is not decorated with @Controller but with other class decorators', async () => {
            try {
                app.addControllers([new UnmarkedClass()]);
            } catch (e) {
                assert.fail('Threw an error.');
            }
            server = app.start(port);
            await UnmarkedClass.validateUnmarkedClass();
        });

        afterEach(() => {
            server.close();
        });
    });
});
