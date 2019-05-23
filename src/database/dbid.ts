export class DBID {
    constructor(
        private localid: number = -1,
        private serverid: number = -1
    ) { }

    localID(): number {
        return this.localid;
    }

    serverID(): number {
        return this.serverid;
    }

    isSavedLocal(): boolean {
        return (this.localid != -1);
    }

    isSavedServer(): boolean {
        return (this.serverid != -1);
    }
}
