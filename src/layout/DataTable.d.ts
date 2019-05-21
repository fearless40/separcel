export declare type DataValue = string | number;
export interface OnChange {
    (id: number[], valueNew: DataValue[], valueOld: DataValue[]): boolean;
}
export interface OnChangeToken {
    readonly token: any;
}
export interface DataItem {
    value: DataValue;
    readonly isReadOnly: boolean;
    readonly id: number;
}
export declare class EmptyDataItem implements DataItem {
    readonly value: string;
    readonly isReadOnly: boolean;
    readonly id: number;
    static readonly EmptyItem: EmptyDataItem;
}
export interface DataView {
    getById(dataID: number): DataItem;
}
export interface DataTable extends DataView {
    maxCountRows(): number;
    maxCountCols(): number;
    getRow(rowIndex: number): Array<DataItem>;
}
