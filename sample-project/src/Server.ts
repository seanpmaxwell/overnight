/**
 * Examples for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import { oServer }     from '@overnight/core'
import { cinfo, cerr } from 'simple-color-print'
import MailPromise     from 'mail-promise'

class Server extends oServer
{
    mailer: MailPromise

    constructor()
    {
        super()
        super.addControllers()
        cinfo('Sample server has been called')


        this.mailer = new MailPromise('Gmail', null, null)
        this.sendMail()
    }

    async sendMail()
    {
        let info = await this.mailer.send('', 'jobappteam', 'new version', 'horse')
        cinfo(info)
    }

}

new Server()