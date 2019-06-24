import { User } from "../data/models/User";
import { UserGroup } from "../data/models/UserGroups";
import { DBID } from "dbid";
import { DataBaseConnection, DBSendAction } from "./dbmsg";

export const enum DbTables {
    users = "users",
    groups = "groups"
}

export class Database implements DataBaseConnection{
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