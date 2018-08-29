/**
 * Example Login for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 28, 2018
 */

import { Request, Response } from 'express'
import { Controller, Post  } from '@overnight/core'
import { cinfo, cerr, }      from 'simple-color-print'
import SampleController      from './SampleController'


@Controller('api/signup')
export default class SignupController extends SampleController
{
    @Post()
    private async signup(req: Request, res: Response): Promise<void>
    {
        try {
            let info = await this.mailer_.send(req.body.email, 'Overnight Developers',
                'Thanks for signing up', 'foo')
            cinfo(info)
            res.status(200).json({msg: 'email_sent_to_' + req.body.email})
        }
        catch(err) {
            cerr(err)
            res.status(400).json({msg: 'problem_sending_email'})
        }
    }
}