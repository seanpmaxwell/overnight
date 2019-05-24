/**
 * Example Sending Email for the OvernightJS web library.
 *
 * created by Sean Maxwell Aug 28, 2018
 */

import { Request, Response } from 'express';
import { Controller, Post  } from '@overnightjs/core';
import { Logger, LoggerModes } from '@overnightjs/logger';
import MailPromise from 'mail-promise';


@Controller('api/signup')
export class SignupController {

    private readonly mailer: MailPromise;
    private readonly logger: Logger;


    constructor() {
        this.mailer = new MailPromise();
        this.logger = new Logger();
    }


    @Post()
    private async signup(req: Request, res: Response): Promise<void> {
        try {
            const info = await this.mailer.send(req.body.email, 'Overnight Developers',
                'Thanks for signing up', '', '<h1>You are awesome</h1>');
            this.logger.info(info.response);
            res.status(200).json({
                message: 'Email sent to ' + req.body.email,
            });
        } catch (err) {
            this.logger.err(err, true);
            res.status(400).json({
                error: 'There was a problem sending the email.'
            });
        }
    }
}
