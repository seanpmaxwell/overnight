
export class DaoBase
{
    protected db_: string

    constructor(dbConn: string)
    {
        this.db_ = dbConn
    }
}