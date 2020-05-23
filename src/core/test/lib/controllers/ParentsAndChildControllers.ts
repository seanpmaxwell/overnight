/**
 * Class to test @ChildControllers.
 *
 * created by Joey Kilpatrick, 2/8/2020
 */

import {Response, Request} from 'express';
import {OK} from 'http-status-codes';

import {ChildControllers, Controller, Get} from '../../../lib/decorators';
import {assertRequest} from '../helpers';
import {HttpVerb} from '../../../lib/decorators/types';

// tslint:disable-next-line:max-classes-per-file
@Controller('child1')
class ChildController1 {


    @Get()
    public get(_req: Request, res: Response): Response {
        return res.status(OK).json({
            message: 'child1',
        });
    }
}

// tslint:disable-next-line:max-classes-per-file
@Controller('child2')
class ChildController2 {


    @Get()
    public get(_req: Request, res: Response): Response {
        return res.status(OK).json({
            message: 'child2',
        });
    }
}

// tslint:disable-next-line:max-classes-per-file
@Controller('child3')
class ChildController3 {


    @Get()
    public get(_req: Request, res: Response): Response {
        return res.status(OK).json({
            message: 'child3',
        });
    }
}

// tslint:disable-next-line:max-classes-per-file
@Controller('parent1')
@ChildControllers(
    new ChildController1(),
)
export class ParentOfSingleChildController {


    @Get()
    public get(_req: Request, res: Response): Response {
        return res.status(OK).json({
            message: 'parent1',
        });
    }


    public static async validateAll(): Promise<void> {
        await assertRequest('/parent1', HttpVerb.GET, {
            body: {
                message: 'parent1',
            },
            status: OK,
        });
        await assertRequest('/parent1/child1', HttpVerb.GET, {
            body: {
                message: 'child1',
            },
            status: OK,
        });
    }
}


// tslint:disable-next-line:max-classes-per-file
@Controller('parent2')
@ChildControllers(
    [new ChildController1()],
)
export class ParentOfArrayOfSingleChildController {


    @Get()
    public get(_req: Request, res: Response): Response {
        return res.status(OK).json({
            message: 'parent2',
        });
    }


    public static async validateAll(): Promise<void> {
        await assertRequest('/parent2', HttpVerb.GET, {
            body: {
                message: 'parent2',
            },
            status: OK,
        });
        await assertRequest('/parent2/child1', HttpVerb.GET, {
            body: {
                message: 'child1',
            },
            status: OK,
        });
    }
}


// tslint:disable-next-line:max-classes-per-file
@Controller('parent3')
@ChildControllers([
    new ChildController1(),
    new ChildController2(),
    new ChildController3(),
])
export class ParentOfArrayOfChildControllers {


    @Get()
    public get(_req: Request, res: Response): Response {
        return res.status(OK).json({
            message: 'parent3',
        });
    }


    public static async validateAll(): Promise<void> {
        await assertRequest('/parent3', HttpVerb.GET, {
            body: {
                message: 'parent3',
            },
            status: OK,
        });
        await assertRequest('/parent3/child1', HttpVerb.GET, {
            body: {
                message: 'child1',
            },
            status: OK,
        });
        await assertRequest('/parent3/child2', HttpVerb.GET, {
            body: {
                message: 'child2',
            },
            status: OK,
        });
        await assertRequest('/parent3/child3', HttpVerb.GET, {
            body: {
                message: 'child3',
            },
            status: OK,
        });
    }
}


// tslint:disable-next-line:max-classes-per-file
@Controller('parent4')
@ChildControllers(new ChildController1())
@ChildControllers(new ChildController2())
@ChildControllers(new ChildController3())
export class ParentOfMultipleChildControllerDecorators {


    @Get()
    public get(_req: Request, res: Response): Response {
        return res.status(OK).json({
            message: 'parent4',
        });
    }


    public static async validateAll(): Promise<void> {
        await assertRequest('/parent4', HttpVerb.GET, {
            body: {
                message: 'parent4',
            },
            status: OK,
        });
        await assertRequest('/parent4/child1', HttpVerb.GET, {
            body: {
                message: 'child1',
            },
            status: OK,
        });
        await assertRequest('/parent4/child2', HttpVerb.GET, {
            body: {
                message: 'child2',
            },
            status: OK,
        });
        await assertRequest('/parent4/child3', HttpVerb.GET, {
            body: {
                message: 'child3',
            },
            status: OK,
        });
    }
}
