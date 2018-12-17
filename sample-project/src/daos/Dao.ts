
export class Dao
{
    protected db_: string

    constructor(dbConn: string)
    {
        this.db_ = dbConn
    }
}