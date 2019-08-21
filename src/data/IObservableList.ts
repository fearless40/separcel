import { EventSimple, IEventSimple } from "../util/EventSimple";

export const enum ChangeEventType {
    Modify,
    Add,
    Remove,
    Reindex
};

export interface IObservableListChangeEvent<Index,Type> {
    owner: IObservableList<Index,Type>;
    event: ChangeEventType
    ids: Index[];
    olds?: Index[];
    values: Type[];
}

export interface IObservableForEachCallBack<Index,Type> {
    (currentValue : Type, index : Index)
}

export interface IObservableIndexValue<Index, Type> {
    id: Index,
    value: Type
}

export interface IObservableIterator<Index, Type> extends Iterator<IObservableIndexValue<Index, Type>> {

}

export interface IObservableList<Index, Type> extends Iterable<Type> {

    push(value: Type): Index
    pop(): Type;
    remove(index: Index);
    removeAll(): void;

    get(idvalue: Index): Type;
    //get_async(ids: Index[]): Promise<Type[]>;

    //set(idvalue : Index, value: Type): void 
    //set_async(ids: Index[], value: Type[]): Promise<boolean>

    events: IEventSimple<IObservableListChangeEvent<Index, Type>>

    length() : number

    forEach(callback : IObservableForEachCallBack<Index, Type>) : void 
    //slice(start: number, end: number): IObservableIterator<Index,Type> 
}
