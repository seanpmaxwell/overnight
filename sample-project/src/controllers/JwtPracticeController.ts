/**
 * Example Controller for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import { Controller, Middleware, Get, Post, Put, Delete } from '@overnightjs/core'
import { jwt, jwtmiddleware, JwtHandler }                 from '@overnightjs/jwt'

import { Request, Response } from 'express'
import { cinfo, cerr }       from 'simple-color-print'
import { ParentController }  from './ParentController'


@Controller('api/jwt')
export class JwtPracticeController extends ParentController
{
    @Get('')
    get(req: Request, res: Response): any
    {
        cinfo('Get Jwt called')
        return res.status(200).json({jwt: 'get_called'})
    }
}