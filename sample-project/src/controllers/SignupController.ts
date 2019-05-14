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
        let msg = 'problem_sending_email';
        let code = 400;
        const email = req.body.email;

        try {
            const info = await this.mailer.send(email, 'Overnight Developers',
                'Thanks for signing up', '', '<h1>You are awesome</h1>');
            this.logger.info(info.response);
            msg = 'email_sent_to_' + email;
            code = 200;
        } catch (err) {
            this.logger.err(err, true);
        } finally {
            res.status(code).json({msg});
        }
    }
}
