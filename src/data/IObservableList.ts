import { EventSimple, IEventSimple } from "../util/EventSimple";


export interface IObservableListChangeEvent<Index,Type> {
    owner: IObservableList<Index,Type>;
    ids: Index[];
    values: Type[];
}

export interface IObservableForEachCallBack<Index,Type> {
    (currentValue : Type, index : Index)
}

export interface IObservableIterator<Index,Type> extends Iterator<Type> {

}


export interface IObservableEvents<Index,Type> {
    onChange: IEventSimple<IObservableListChangeEvent<Index,Type>>
    onErase: IEventSimple<IObservableListChangeEvent<Index, Type>>
    onAdd: IEventSimple<IObservableListChangeEvent<Index, Type>>
}

export interface IObservableList<Index, Type> extends Iterable<Type> {

    push(value: Type): Index
    pop(): Type;
    remove(index: Index);
    removeAll(): void;

    get(idvalue: Index): Type;
    //get_async(ids: Index[]): Promise<Type[]>;

    set(idvalue : Index, value: Type): void 
    set_async(ids: Index[], value: Type[]): Promise<boolean>

    events: IObservableEvents<Index,Type>

    length() : number

    forEach(callback : IObservableForEachCallBack<Index, Type>) : void 
    slice(start: number, end: number): IObservableIterator<Index,Type> 
}