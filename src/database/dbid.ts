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
    dbid : DBID
}