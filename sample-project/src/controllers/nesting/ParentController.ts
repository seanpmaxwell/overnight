/**
 * Controller for developing nested Controllers.
 *
 * created by Sean Maxwell May 25, 2019
 */

import { Controller, Children } from '@overnightjs/core';
import { ChildA1Controller } from './a-children/ChildA1Controller';

@Controller('api/v1')
@Children([new ChildA1Controller()])
export class ParentController {

}
