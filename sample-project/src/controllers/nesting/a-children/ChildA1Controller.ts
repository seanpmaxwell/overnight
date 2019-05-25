/**
 * ChildA1Controller
 *
 * created by Sean Maxwell May 25, 2019
 */

import { Controller } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';


@Controller('child-a1')
class ChildA1Controller {

    private readonly logger: Logger;


    constructor() {
        this.logger = new Logger();
    }
}
