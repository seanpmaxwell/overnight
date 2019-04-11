/**
 * Custom Logging tool to test Overnight/logger custom logging option.
 *
 * created by Sean Maxwell April 10, 2019
 */

import { ICustomLogger } from '@overnightjs/logger';


export class ExternalTool implements ICustomLogger {


    public sendLog(content: any): void {

        // pick up here tomorrow
    }
}
