
export interface TableRangeForEach {
    (row:number, col:number) : void 
}

export class TableRange {
    constructor(public row_start: number, public row_end: number,
        public col_start: number, public col_end: number) { }

    isEmpty(): boolean {
        return (this.row_start < 0 || this.row_end < 0 || this.col_end < 0 || this.col_start < 0)
    }

    forEach(cb: TableRangeForEach) {
        for (let r = this.row_start; r <= this.row_end; ++r) {
            for (let c = this.col_start; c <= this.col_end; ++c) {
                cb(r, c);
            }
        }
    }
}