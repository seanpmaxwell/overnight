/**
 * Example Controller for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import { oController, Controller } from '@overnight/core'
import { cinfo, cerr }             from 'simple-color-print'


@Controller('api/users')
export default class UserController extends oController
{
    constructor()
    {
        super()
    }

    private getOne(): void
    {

    }
}