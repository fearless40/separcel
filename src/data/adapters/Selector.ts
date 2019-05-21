import {DataTable, DataItem} from "../Data"


export class GetSingleDataItem implements DataTable {
    private mDT: DataTable
    private mID: number;

    constructor(datatabletowrap: DataTable, idtoget: number) {
        this.mDT = datatabletowrap;
        this.mID = idtoget;
    }

    maxCountRows(): number {
        return 1;
    }

    maxCountCols(): number {
        return 1;
    }

    getById(id: number): DataItem {
        return this.mDT.getById(this.mID);
    }

    getRow(row: number): DataItem[] {
        return [this.getById(0)];
    }
}

export class LimitColumns implements DataTable {
    private mDT: DataTable
    private mColStart: number;
    private mColEnd: number;

    constructor(datatabletowrap: DataTable, colstart: number, colend?:number) {
        this.mDT = datatabletowrap;
        this.mColStart = colstart;
        colend = colend || colstart;
        this.mColEnd = colend + 1;
    }

    maxCountRows(): number {
        return this.mDT.maxCountRows();
    }
    
    maxCountCols(): number {
        return (this.mColEnd-this.mColStart) ;
    }

    getById(id: number): DataItem {
        return this.mDT.getById(id);
    }

    getRow(row: number): DataItem[] {
        return this.mDT.getRow(row).slice(this.mColStart, this.mColEnd);
    }
}