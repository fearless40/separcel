import { DataItem } from "./DataTable";
export declare type Cell2d = Array<Array<Cell>>;
export declare function MaxColumns(items: Cell2d): number;
export declare const enum CellType {
    HeaderCell = 0,
    BodyCell = 1,
    FooterCell = 2,
}
export declare class Cell {
    rowspan: number;
    colspan: number;
    data: DataItem;
    isHeader: boolean;
    constructor(data: DataItem, rowspan?: number, colspan?: number);
    isEmpty(): boolean;
    static readonly EmptyCell: Cell;
    cssClasses: string[];
}
