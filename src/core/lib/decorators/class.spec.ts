import * as http from 'http';
import 'mocha';

import {
    CaseInsensitiveController,
    CaseSensitiveController,
    ParentOfArrayOfChildControllers,
    ParentOfArrayOfChildren,
    ParentOfArrayOfSingleChild,
    ParentOfArrayOfSingleChildController,
    ParentOfSingleChild,
    ParentOfSingleChildController,
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

        afterEach(() => {
            server.close();
        });
    });
});
