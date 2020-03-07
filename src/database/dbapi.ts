export class DBID {
    constructor(
        readonly localid: any = -1,
        readonly serverid: any = -1
    ) { }

    /*    localID(): number {
            return this.localid;
        }
    
        serverID(): number {
            return this.serverid;
        }
    */
    isSavedLocal(): boolean {
        return (this.localid != -1);
    }

    isSavedServer(): boolean {
        return (this.serverid != -1);
    }

}


export interface DBItem {
    dbid: DBID
}

export interface Transaction {
    create(value: any): void
    update(id: DBID, value: any): void
    remove(id: DBID): void
}

export interface Database {
    open(criteria: any): Promise<boolean>
    close(): void

    createTransaction(): Transaction
    commitTransaction(trans: Transaction)

    query(criteria : any) : []
}

/*export class Database implements DataBaseConnection{
    private localdb: DataBaseConnection;
    private serverdb: DataBaseConnection;
    


    async send(msg: DBMsgSend): Promise<DBSendResult> {

        let localresult: DBSendResult
        let serverresult: DBSendResult
        let retval: DBSendResult = {
            ok: true
        }

        let errors = new Array<string>();

        try {
            if (this.localdb) {
                localresult = await this.localdb.send(msg);
            }
        }
        catch {
            retval.ok = false;
            errors.push("LocalDB Error");
            //todo: publish event that supplies the error value
        }

        try {
            if (this.serverdb) {
                serverresult = await this.serverdb.send(msg);
            }
        }
        catch {
            retval.ok = false;
            errors.push("Server Error");
            //todo: publish event that supplies the error value
        }

        const dbid = new DBID(localresult.dbid.localID(), serverresult.dbid.serverID());

        retval.dbid = dbid;
        if (errors.length > 0) {
            retval.errors = errors;
        }
        
        return retval;
    }

    async get(msg: DBMsgGet): Promise<DBGetResult> {
        throw new Error("Method not implemented.");
    }

    

    users = new UsersFactory();
}
*/