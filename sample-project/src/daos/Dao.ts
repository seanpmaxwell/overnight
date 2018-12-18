/**
 * Dummy Data-Access-Object superclass.
 *
 * created by Sean Maxwell Dec 17, 2018
 */

export class Dao
{
    protected db_: string

    constructor(dbConn: string)
    {
        this.db_ = dbConn
    }
}