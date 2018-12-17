/**
 *
 *
 * created by Sean Maxwell Dec 16, 2018
 */

import { Dao }     from '@overnightjs/core'
import { DaoBase } from './DaoBase'


@Dao
export class UserDao extends DaoBase
{
    fetchUser(): void
    {
        console.log(this.db_)
    }
}