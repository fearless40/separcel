

export interface IDataIterableReturn<Index, Value> {
    id: Index,
    value: Value
}

export interface IDataListR<Index, Value> extends Iterable<IDataIterableReturn<Index, Value>>{
    get(id: Index): Value;
    length() : number;
    forEach(callback: (value: Value, index: Index) => void);
    toArray() : Value[]
}

export interface IDataListRW<Index, Value> extends IDataListR<Index,Value>{
    set(id: Index, value: Value): void
    add(value: Value | Array<Value> | IDataListR<Index, Value>): Index | Array<Index>
    remove(id: Index): Value
}

export interface IDataMapR<Index,Value> extends IDataListR<Index, Value> {
    //map<NewValue>(callback: (index: number, value: Value) => NewValue): IDataArrayR<NewValue>
    //reduce<NewValue>(callback: (index: number, value: Value) => NewValue): NewValue
    has(): boolean;
}

export interface IDataMapRW<Index, Value> extends IDataMapR<Index, Value> {
    //map<NewValue>(callback: (index: number, value: Value) => NewValue): IDataArrayR<NewValue>
    //reduce<NewValue>(callback: (index: number, value: Value) => NewValue): NewValue
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


export interface IDataTablePosition {
    row: number
    col: number
}

export type IDataTableIndex<Index> = IDataTablePosition | Index;

export interface IDataTableR<Index, Value> extends IDataListR<IDataTableIndex<Index> ,Value> {
    row_length(): number
    col_length(): number

    row_get(row : number): Array<Value>;
    col_get(col: number): Array<Value>;

    get(row: number, col: number): Value;
    get(id: Index): Value;
}

export interface IDataTableRW<Index, Value> extends IDataTableR<Index, Value> {
    row_set(row: number, data: Array<Value> ): void
    col_set(col: number, data: Array<Value> ): void

    set(row: number, col: number, data: Value): void;
    set(index: IDataTableIndex<Index>, data : Value) : void
}


