import { DBID, DBItem } from "./dbid";

export const enum DBConnectionType {
    Local = "local",
    Server = "server"
}

export interface DBResult {
    errors?: string[]
}

export interface DBSendResult extends DBResult {
    ok: boolean
    dbid?: DBID //returns the id of the newly created item or deleted or modified object
    // on failure dbid is not equal to the id sent in
}

export interface DBGetResult extends DBResult {
    values: any[]
}

export const enum DBCompare {
    Eq = 0,
    GEq = 1,
    GT = 2,
    LEq = 3,
    LT = 4,
    NE = 5
}

export const enum DBSendAction {
    Create = 1,
    Update = 2,
    CreateOrUpdate = Create | Update,
    Delete = 4
}

export interface DBQueryField {
    field: string
    value: string
    comparison: DBCompare
}

export interface DBQueryAll {
    all: boolean
}

export interface DBQueryBetween {
    field: string
    min: string
    max: string
}

export type DBQuery = DBQueryField | DBQueryAll | DBQueryBetween

export function dbQueryIsAll(item : DBQuery) : item is DBQueryAll {
    return ((item as DBQueryAll).all !== undefined); 
}

export function dbQueryIsBetween(item: DBQuery): item is DBQueryBetween {
    return ((item as DBQueryBetween).min !== undefined);
}

export function dbQueryIsField(item: DBQuery): item is DBQueryField {
    return ((item as DBQueryField).value !== undefined);
}



export interface DBMsgGet {
    table: string
    query: {
        by: DBQuery
        fields?: string[]
    }
}

export interface DBMsgSend {
    table: string
    action: DBSendAction
    values: DBItem[]
}



export interface DataBaseConnection {
    send(msg: DBMsgSend): Promise<DBSendResult>
    get(msg: DBMsgGet): Promise<DBGetResult>
}
