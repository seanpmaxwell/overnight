/**
 * Class to test if controller errors when
 * undefined behavior occurs.
 *
 * created by Joey Kilpatrick, 2/10/2020
 */

import {Request, Response} from 'express';
import {NOT_FOUND, OK} from 'http-status-codes';

import {assertRequest} from '../helpers';
import {ChildControllers, ClassOptions, Controller, Get, Wrapper} from '../../../lib';
import {HttpVerb} from '../../../lib/decorators/types';

@Controller('badChildren')
// tslint:disable-next-line:no-empty
@ChildControllers(['', 1, Symbol(), {}, (): void => {}])
export class NonControllerChildController {


    @Get()
    private get(_req: Request, res: Response): any {
        return res.status(OK).json({
            message: 'badChildren',
        });
    }


    public static async validateBadChildren(): Promise<void> {
        await assertRequest('/badChildren', HttpVerb.GET, {
            body: {
                message: 'badChildren',
            },
            status: OK,
        });
    }

}

@Controller('undecoratedProperties')
// tslint:disable-next-line:max-classes-per-file
export class UndecoratedPropertiesController {


    @Get()
    private get(_req: Request, res: Response): any {
        return res.status(OK).json({
            message: 'undecoratedProperties',
        });
    }


    // tslint:disable-next-line:no-empty
    private undecoratedMethod(): void {}


    private undecoratedProperty: string = '';


    // tslint:disable-next-line:no-empty
    private undecoratedFunctionProperty: () => void = () => {};


    public static async validateUndecoratedProperties(): Promise<void> {
        await assertRequest('/undecoratedProperties', HttpVerb.GET, {
            body: {
                message: 'undecoratedProperties',
            },
            status: OK,
        });
    }

}

// tslint:disable-next-line:max-classes-per-file
export class UndecoratedClass {


    @Get('undecoratedClass')
    private get(_req: Request, res: Response): any {
        return res.status(OK).json({
            message: 'undecoratedClass',
        });
    }


    public static async validateUndecoratedClass(): Promise<void> {
        await assertRequest('/undecoratedClass', HttpVerb.GET, {
            body: null,
            status: NOT_FOUND,
        });
        await assertRequest('//undecoratedClass', HttpVerb.GET, {
            body: null,
            status: NOT_FOUND,
        });
    }

}

@ClassOptions({})
// tslint:disable-next-line:max-classes-per-file
export class UnmarkedClass {


    @Get('unmarkedClass')
    private get(_req: Request, res: Response): any {
        return res.status(OK).json({
            message: 'unmarkedClass',
        });
    }


    public static async validateUnmarkedClass(): Promise<void> {
        await assertRequest('/unmarkedClass', HttpVerb.GET, {
            body: null,
            status: NOT_FOUND,
        });
        await assertRequest('//unmarkedClass', HttpVerb.GET, {
            body: null,
            status: NOT_FOUND,
        });
    }

}

@Controller('unmarkedMethod')
// tslint:disable-next-line:max-classes-per-file
export class UnmarkedMethodController {


    @Wrapper((method: any) => {
        return method;
    })
    private get(_req: Request, res: Response): any {
        return res.status(OK).json({
            message: 'unmarkedMethod',
        });
    }


    public static async validateUnmarkedMethod(): Promise<void> {
        await assertRequest('/unmarkedMethod', HttpVerb.GET, {
            body: null,
            status: NOT_FOUND,
        });
    }

}

