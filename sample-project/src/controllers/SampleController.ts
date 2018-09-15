/**
 * Example Controller Parent class for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 27, 2018
 */

import { MailPromise } from 'mail-promise'


export class SampleController
{
    protected mailer_: MailPromise

    setMailer(mailer: MailPromise): void
    {
        this.mailer_ = mailer
    }
}