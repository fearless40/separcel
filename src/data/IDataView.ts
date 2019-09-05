import { EventSimple } from "../util/EventSimple";


export interface IDataIterableReturn<Index, Value> {
    id: Index,
    value: Value
}

export interface IDataListR<Index, Value> extends Iterable<IDataIterableReturn<Index, Value>>{
    get(id: Index): Value;
    length() : number;
    forEach(callback: (index: Index, value: Value) => { });
}

export interface IDataListRW<Index, Value> extends IDataListR<Index,Value>{
    set(id: Index, value : Value): void
}


export interface IDataArrayR<Value> extends IDataListR<number, Value> {
    //map<NewValue>(callback: (index: number, value: Value) => NewValue): IDataArrayR<NewValue>
    //reduce<NewValue>(callback: (index: number, value: Value) => NewValue): NewValue
}

export interface IDataArrayRW<Value> extends IDataArrayR<Value> {
    //map<NewValue>(callback: (index: number, value: Value) => NewValue): IDataArrayR<NewValue>
    //reduce<NewValue>(callback: (index: number, value: Value) => NewValue): NewValue
    //sort(callback: (index: number, value: Value) => number): void;
    push(Value): number;
    pop(): Value;
    remove(index: number);
    removeAll(): void;

}


export interface IDataTablePosition<Index> {
    row: number
    col: number
    id?: Index;
}

export type IDataTableIndex<Index> = IDataTablePosition<Index> | Index;

export interface IDataTableR<Index, Value> extends IDataListR<IDataTableIndex<Index> ,Value> {
    rowCount(): number
    colCount(): number

    getRow(row : number): IDataArrayR<Value>;
    getCol(col: number): IDataArrayR<Value>;
}

export interface IDataTableRW<Index, Value> extends IDataTableR<Index, Value> {
    rowCount(): number
    colCount(): number

    getRow(row: number): IDataArrayR<Value>;
    getCol(col: number): IDataArrayR<Value>;

    setRow(row: number, data: IDataArrayR<Value> | Array<Value>): void
    setCol(col: number, data: IDataArrayR<Value> | Array<Value>): void
}


export const enum IObservableEventType {
    Add,
    Change,
    Remove,
    Reindex
};


export interface IObservableEvent<Owner, Index, Value> {
    owner: Owner;
    type: IObservableEventType;
    id: Index;
    value: Value;
}

export interface IObservable<Index, Value> {
    
}