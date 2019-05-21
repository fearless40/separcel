import { DataItem, NullDataItem } from "../data/Data"

export type Cell2d = Array<Array<Cell>>

export function MaxColumns(items: Cell2d): number {
    let maxCol = 0;
    for (let row of items) {
        maxCol = Math.max(row.length, maxCol);
    }
    return maxCol;
}

export interface Cell {
    rowspan: number
    colspan: number
    data: DataItem
    isReadOnly: boolean
    isEmpty(): boolean 
    cssClasses: string[];
}


export class CellSimple implements Cell {
    public rowspan: number
    public colspan: number
    public data: DataItem
    public isReadOnly: boolean

    constructor(data: DataItem, rowspan: number = 1, colspan: number = 1) {
        this.rowspan = rowspan;
        this.colspan = colspan;
        this.data = data;
    }

    isEmpty(): boolean {
        return (this.rowspan <= 0 || this.colspan <= 0);
    }

    public static readonly EmptyCell = new CellSimple(NullDataItem.NullDataItem, -1, -1);
    public cssClasses: string[] = [];
}


    


