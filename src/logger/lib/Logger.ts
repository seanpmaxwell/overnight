/**
 * Logging classes for the overnight project
 *
 * created by Sean Maxwell Apr 5, 2019
 */

import * as colors from 'colors';
import * as util from 'util'


export class Logger {

    private readonly toFile: boolean | undefined;
    private readonly filePath: string | undefined;


    constructor(toFile?: boolean, filePath?: string) {
        this.toFile = toFile;
        this.filePath = filePath;
    }


    public info(content: any, printFull?: boolean): void {

        if (printFull) {
            console.log(content);
        } else {
            console.log(util(content));
        }
    }
}
