/**
 * Example Controller for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import { Controller, Middleware, Get, Post, Put, Delete } from '@overnightjs/core'
import { Request, Response } from 'express'
import { cinfo, cerr }       from 'simple-color-print'
import { getJwtMiddleware }  from './Middlware'
import { ParentController }  from './ParentController'


@Controller('api/jwt')
export class JwtPracticeController extends ParentController
{

}