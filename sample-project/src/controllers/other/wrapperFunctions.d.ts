import { RequestHandler, Request, Response, NextFunction } from 'express';
export declare const asyncWrapper: (action: RequestHandler) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
export declare const genericWrapper: (action: RequestHandler) => (req: Request, res: Response, next: NextFunction) => any;
export declare const asyncFunction: (fail?: boolean | undefined) => Promise<{}>;
