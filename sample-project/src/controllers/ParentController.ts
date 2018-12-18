/**
 * Example Controller Parent class for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 27, 2018
 */

import { MailPromise } from 'mail-promise'
import { UserDao }     from '../daos/UserDao'


export class ParentController
{
    protected mailer_: MailPromise
    protected userDao_: UserDao

    setUserDao(userDao: UserDao): void
    {
        this.userDao_ = userDao
    }

    setMailer(mailer: MailPromise): void
    {
        this.mailer_ = mailer
    }
}