/**
 * Logging classes for the overnight project
 *
 * created by Sean Maxwell Apr 5, 2019
 */

import * as colors from 'colors';
import * as util from 'util';


export class Logger {

    private readonly turnOff: boolean | undefined;
    private readonly toFile: boolean | undefined;
    private readonly filePath: string | undefined;


    constructor(turnOff?: boolean, toFile?: boolean, filePath?: string) {
        this.turnOff = turnOff || false;
        this.toFile = toFile;
        this.filePath = filePath;
    }


    public info(content: any, printFull?: boolean): void {

        if (this.turnOff) { return; }

        if (printFull) {
            console.log(util.inspect(content));
        } else {
            console.log(content);
        }
    }


    public imp(content: any, printFull?: boolean): void {

        if (this.turnOff) { return; }

        if (printFull) {
            content = util.inspect(content);
            console.log(colors.magenta(content));
        } else {
            console.log(colors.magenta(content));
        }
    }
}
