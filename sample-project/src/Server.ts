/**
 * Examples for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import { oServer }     from '@overnight/core'
import { cinfo, cerr } from 'simple-color-print'


class Server extends oServer
{
    constructor()
    {
        super()
        super.addControllers()
        cinfo('Sample server has been called')
    }

}

new Server()