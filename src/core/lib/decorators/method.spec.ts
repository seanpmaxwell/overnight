import * as http from 'http';

import {
    AllHttpVerbsController,
    HeadController,
    RegExpController,
    SimpleController,
} from '../../test/lib/controllers';
import {port} from '../../test/lib/helpers';
import TestingServer from '../../test/lib/TestingServer';

let app: TestingServer;
let server: http.Server;

describe('Method Decorators', () => {
    beforeEach(() => {
        app = new TestingServer(false);
        app.addControllers([
            new AllHttpVerbsController(),
            new HeadController(),
            new SimpleController(),
            new RegExpController(),
        ]);
        server = app.start(port);
    });

    it('should include all HTTP verbs (except @Head) as simple decorators', async () => {
        await AllHttpVerbsController.validateAll();
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

    afterEach(() => {
        server.close();
    });
});
