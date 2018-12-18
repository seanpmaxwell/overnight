/**
 * Dummy User Dao. Just prints to the console doesn't
 * actually fetch a user object.
 *
 * created by Sean Maxwell Dec 16, 2018
 */

import { Dao } from './Dao'


export class UserDao extends Dao
{
    fetchUser(): void
    {
        console.log(this.db_ + ' successfully fetched user')
    }
}