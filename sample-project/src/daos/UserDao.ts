/**
 *
 *
 * created by Sean Maxwell Dec 16, 2018
 */

import { Dao } from './Dao'


export class UserDao extends Dao
{
    fetchUser(): void
    {
        console.log(this.db_)
    }
}