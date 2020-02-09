/**
 * Class to test all HTTP verbs as decorators.
 *
 * created by Joey Kilpatrick, 2/6/2020
 */

import { Request, Response } from 'express';
import {OK} from 'http-status-codes';

import {assertRequest} from '../helpers';
import * as Decorators from '../../../lib';
import {HttpVerb} from '../../../lib/decorators/types';

@Decorators.Controller('allHttpVerbs')
export class AllHttpVerbsController {


    // @Head is excluded since Express treats router.head(...) differently


    @Decorators.Checkout()
    public checkout(req: Request, res: Response): any {
        return res.status(OK).json({
            method: HttpVerb.CHECKOUT,
        });
    }


    @Decorators.Copy()
    public copy(req: Request, res: Response): any {
        return res.status(OK).json({
            method: HttpVerb.COPY,
        });
    }


    @Decorators.Delete()
    public delete(req: Request, res: Response): any {
        return res.status(OK).json({
            method: HttpVerb.DELETE,
        });
    }


    @Decorators.Get()
    public get(req: Request, res: Response): any {
        return res.status(OK).json({
            method: HttpVerb.GET,
        });
    }


    @Decorators.Lock()
    public lock(req: Request, res: Response): any {
        return res.status(OK).json({
            method: HttpVerb.LOCK,
        });
    }


    @Decorators.Merge()
    public merge(req: Request, res: Response): any {
        return res.status(OK).json({
            method: HttpVerb.MERGE,
        });
    }


    @Decorators.Mkactivity()
    public mkactivity(req: Request, res: Response): any {
        return res.status(OK).json({
            method: HttpVerb.MKACTIVITY,
        });
    }


    @Decorators.Mkcol()
    public mkcol(req: Request, res: Response): any {
        return res.status(OK).json({
            method: HttpVerb.MKCOL,
        });
    }


    @Decorators.Move()
    public move(req: Request, res: Response): any {
        return res.status(OK).json({
            method: HttpVerb.MOVE,
        });
    }


    @Decorators.MSearch()
    public msearch(req: Request, res: Response): any {
        return res.status(OK).json({
            method: HttpVerb.MSEARCH,
        });
    }


    @Decorators.Notify()
    public notify(req: Request, res: Response): any {
        return res.status(OK).json({
            method: HttpVerb.NOTIFY,
        });
    }


    @Decorators.Options()
    public options(req: Request, res: Response): any {
        return res.status(OK).json({
            method: HttpVerb.OPTIONS,
        });
    }


    @Decorators.Patch()
    public patch(req: Request, res: Response): any {
        return res.status(OK).json({
            method: HttpVerb.PATCH,
        });
    }


    @Decorators.Post()
    public post(req: Request, res: Response): any {
        return res.status(OK).json({
            method: HttpVerb.POST,
        });
    }


    @Decorators.Purge()
    public purge(req: Request, res: Response): any {
        return res.status(OK).json({
            method: HttpVerb.PURGE,
        });
    }


    @Decorators.Put()
    public put(req: Request, res: Response): any {
        return res.status(OK).json({
            method: HttpVerb.PUT,
        });
    }


    @Decorators.Report()
    public report(req: Request, res: Response): any {
        return res.status(OK).json({
            method: HttpVerb.REPORT,
        });
    }


    @Decorators.Search()
    public search(req: Request, res: Response): any {
        return res.status(OK).json({
            method: HttpVerb.SEARCH,
        });
    }


    @Decorators.Subscribe()
    public subscribe(req: Request, res: Response): any {
        return res.status(OK).json({
            method: HttpVerb.SUBSCRIBE,
        });
    }


    @Decorators.Trace()
    public trace(req: Request, res: Response): any {
        return res.status(OK).json({
            method: HttpVerb.TRACE,
        });
    }


    @Decorators.Unlock()
    public unlock(req: Request, res: Response): any {
        return res.status(OK).json({
            method: HttpVerb.UNLOCK,
        });
    }


    @Decorators.Unsubscribe()
    public unsubscribe(req: Request, res: Response): any {
        return res.status(OK).json({
            method: HttpVerb.UNSUBSCRIBE,
        });
    }


    public static async validateAll(): Promise<void> {
        const assertRequestPromises: Array<Promise<void>> = [];
        for (const verb of Object.values(HttpVerb)) {
            if (verb === HttpVerb.HEAD) { // Ignore HEAD
                continue;
            }
            assertRequestPromises.push(assertRequest('/allHttpVerbs', verb as HttpVerb, {
                body: {
                    method: verb as HttpVerb,
                },
                status: OK,
            }));
        }
        await Promise.all(assertRequestPromises);
    }

}

