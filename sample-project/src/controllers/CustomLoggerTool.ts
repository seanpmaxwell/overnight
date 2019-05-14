/**
 * Custom Logging tool to test Overnight/logger custom logging option. Replace the
 * 'thirdPartyLoggingApplication' function with a logging tool of your choice i.e. ElasticSearch
 * MongoDB or whatever.
 *
 * created by Sean Maxwell April 10, 2019
 */

import * as colors from 'colors';
import { ICustomLogger } from '@overnightjs/logger';


class CustomLoggerTool implements ICustomLogger {

    private readonly thirdPartyLoggingApplication: ((log: any) => void);


    constructor() {
        this.thirdPartyLoggingApplication = (log: any) => {
            // tslint:disable-next-line
            console.log(colors.america(log));
        };
    }


    public sendLog(content: any): void {
        this.thirdPartyLoggingApplication(content);
    }
}

export default CustomLoggerTool;
