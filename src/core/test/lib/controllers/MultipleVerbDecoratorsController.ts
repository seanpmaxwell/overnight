/**
 * Class to test multiple HTTP verb decorators on a method.
 *
 * created by Joey Kilpatrick, 2/9/2020
 */

import {Request, Response} from 'express';
import {OK} from 'http-status-codes';

import {assertRequest} from '../helpers';
import {Controller, Delete, Get, Post, Put} from '../../../lib';
import {HttpVerb} from '../../../lib/decorators/types';

@Controller('multipleVerbDecorators')
export class MultipleVerbDecoratorsController {


    @Get()
    @Get('get')
    @Post('post')
    @Put('put')
    @Delete('delete')
    public all(req: Request, res: Response): Response {
        return res.status(OK).json({
            message: 'multipleVerbDecorators',
        });
    }


    public static async validateAll(): Promise<void> {
        const assertRequestPromises: Array<Promise<void>> = [];
        assertRequestPromises.push(
            assertRequest('/multipleVerbDecorators', HttpVerb.GET, {
                    body: {
                        message: 'multipleVerbDecorators',
                    },
                    status: OK,
                },
            ),
            assertRequest('/multipleVerbDecorators/get', HttpVerb.GET, {
                    body: {
                        message: 'multipleVerbDecorators',
                    },
                    status: OK,
                },
            ),
            assertRequest('/multipleVerbDecorators/post', HttpVerb.POST, {
                    body: {
                        message: 'multipleVerbDecorators',
                    },
                    status: OK,
                },
            ),
            assertRequest('/multipleVerbDecorators/put', HttpVerb.PUT, {
                    body: {
                        message: 'multipleVerbDecorators',
                    },
                    status: OK,
                },
            ),
            assertRequest('/multipleVerbDecorators/delete', HttpVerb.DELETE, {
                    body: {
                        message: 'multipleVerbDecorators',
                    },
                    status: OK,
                },
            ),
            assertRequest('/multipleVerbDecorators', HttpVerb.HEAD, {
                body: null,
                status: OK,
            }),
            assertRequest('/multipleVerbDecorators/get', HttpVerb.HEAD, {
                body: null,
                status: OK,
            }),
        );
        await Promise.all(assertRequestPromises);
    }

}

