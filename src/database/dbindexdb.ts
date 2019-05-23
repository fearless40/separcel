import { DBConnectionType, DataBaseConnection } from "./dbmsg";
import { openDB, deleteDB, wrap, unwrap } from 'idb'

export class IndexDB implements DataBaseConnection {
    static readonly dbName = "ScheduleMain";
    static readonly dbVersion = 1;

    private db: IDBDatabase;

    getType() : DBConnectionType {
        return DBConnectionType.Local;
    }
       
    async open() : Promise<boolean> {
        this.db = await openDB(IndexDB.dbName, IndexDB.dbVersion, {
            upgrade(db: IDBDatabase, oldVersion: string, newVersion: string, transaction: IDBTransaction) {
                IndexDB.upgrade(db, oldVersion, newVersion, transaction);
            }
        });
        if (this.db) {
            return true;
        } else {
            return false;
        }
    };

    static upgrade(db: IDBDatabase, oldVersion: string, newVersion: string, transaction: IDBTransaction): void {
        
        db.createObjectStore("users", { keyPath: "dbid.localid", autoIncrement: true });
        db.createObjectStore("usergroups", { keyPath: "dbid.localid", autoIncrement: true });
    };

    send(msg: import("./dbmsg").DBMsgSend): Promise<import("./dbmsg").DBSendResult> {
        throw new Error("Method not implemented.");
    };

    get(msg: import("./dbmsg").DBMsgGet): Promise<import("./dbmsg").DBGetResult> {
        throw new Error("Method not implemented.");
    };


}