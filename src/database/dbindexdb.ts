import { DBConnectionType, DataBaseConnection, DBSendResult, DBMsgSend, DBMsgGet, DBSendAction, DBGetResult, dbQueryIsAll, DBQuery } from "./dbmsg";
import { openDB, deleteDB, wrap, unwrap } from 'idb'
import { DbTables } from "./dbapi";
import { User } from "../data/models/User";
import { DBID, DBItem } from "./dbid";

const enum openmodes {
    readonly = 'readonly',
    readwrite = 'readwrite'
};

interface trans_helper {
    transaction: IDBTransaction
    objectstore: IDBObjectStore
};

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
            
        });
        if (this.db) {
            return true;
        } else {
            return false;
        }
    };

    static upgrade(db: IDBDatabase, oldVersion: string, newVersion: string, transaction: IDBTransaction): void {
        
        let objStore = db.createObjectStore("users", { keyPath: "dbid.localid", autoIncrement: true });
        objStore.createIndex("serverID", "dbid.serverid");

        db.createObjectStore("usergroups", { keyPath: "dbid.localid", autoIncrement: true });
    };

    send(msg: DBMsgSend): Promise<DBSendResult> {
        //throw new Error("Method not implemented.");

        switch (msg.table) {
            case DbTables.users:
                return this.send_users(msg);

        }

    };

    get(msg: DBMsgGet): Promise<DBGetResult> {
        switch (msg.table) {
            case DbTables.users:
                return this.get_users(msg);
        }
    };

    private async open_objectstore(store: string): Promise<trans_helper> {
        const trans = await this.db.transaction(store);
        const objs = await trans.objectStore(store);
        return {
            transaction: trans,
            objectstore: objs
        };
    }

    

    private async create(item: DBItem, table : DbTables): Promise<DBSendResult> {
        try {
            //const trans = await this.db.transaction(DbTables.users, openmodes.readwrite);
            //const objst = await trans.objectStore(DbTables.users);
            const helper = await this.open_objectstore(table);
            const result = await helper.objectstore.add(item);
            return {
                ok: true,
                dbid: new DBID(result.result, item.dbid.serverid)
            };
            
        }
        catch (err){
            
            return {
                ok: false,
                dbid: new DBID(-1, item.dbid.serverid),
                errors: [err]
            };
        }
        
    }

    private async update(item: DBItem, table: DbTables): Promise<DBSendResult> {
        try {
            const helper = await this.open_objectstore(table);
            const result = await helper.objectstore.put(item);
            return {
                ok: true,
                dbid: new DBID(result.result, item.dbid.serverid)
            };

        }
        catch (err) {

            return {
                ok: false,
                dbid: new DBID(-1, item.dbid.serverid),
                errors: [err]
            };
        }

    }

    private async delete(item: DBItem, table: DbTables ) : Promise<DBSendResult>{
        try {
            const helper = await this.open_objectstore(table);
            const result = await helper.objectstore.delete(item.dbid.localid);
            return {
                ok: true,
                dbid: new DBID(-1, item.dbid.serverid)
            };

        }
        catch (err) {
            return {
                ok: false,
                dbid: new DBID(-1, item.dbid.serverid),
                errors: [err]
            };
        }
    }
    
    private send_users(msg: DBMsgSend): Promise<DBSendResult> {
        switch (msg.action) {
            case DBSendAction.Create:
                return this.create(msg.values[0], DbTables.users);
            case DBSendAction.Update:
            case DBSendAction.CreateOrUpdate:
                return this.update(msg.values[0], DbTables.users);
            
        }
    }

    private async getDB(query : DBQuery, table : DbTables): Promise<DBGetResult> {
        if (dbQueryIsAll(query)) {
            return this.get_all(table);
        }
    }

    private async get_all(table: DbTables) : Promise<DBGetResult> {
        try {
            const helper = await this.open_objectstore(table);
            const values = await helper.objectstore.getAll();
            return {
                values: values.result
            };
        }
        catch (err) {
            return {
                errors: ["Unable to retireve the requested data"],
                values: []
            };
        }
    }

    private get_users(msg: DBMsgGet): Promise<DBGetResult> {
        return this.getDB(msg.query.by, DbTables.users);
    }
}