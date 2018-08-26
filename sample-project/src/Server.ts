/**
 * Examples for the Overnight web-framework.
 *
 * created by Sean Maxwell Aug 26, 2018
 */

import { cinfo, cerr, cwarn, cimp } from 'simple-color-print'


class Server
{
    constructor()
    {
        cinfo('slim');
        cerr('chicken');
        cwarn('pig');
        cimp({cheets: 'cheeta'})
    }

}

new Server();