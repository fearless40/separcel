import { EventSimple, IEventSimple } from "../util/EventSimple";

export const enum ChangeEventType {
    Modify,
    Add,
    Remove,
    Reindex
};

export interface ChangeReindexValues {
    newid: number
    oldid: number
}

export interface IObervableChangeReindex<Type> {
    event: ChangeEventType.Reindex
    owner: IObservableVector<Type>
    ids: ChangeReindexValues[]
}

export interface IObservableModifyEvent<Type> {
    event: ChangeEventType
    owner: IObservableVector<Type>;
    ids: number[];
    values: Type[];
}

export type IObservableEvent<Type> = IObervableChangeReindex<Type> | IObservableModifyEvent<Type>;

export interface IObservableForEachCallBack<Type> {
    (value : Type, index : number)
}

export interface IObservableIterReturn<Type> {
    id: number,
    value: Type
}

export interface IObservableIterator<Type> extends Iterator<IObservableIterReturn<Type>> {

}

export interface IObservableVector<Type> extends Iterable<Type> {

    push(value: Type): number
    pop(): Type;
    remove(index: number);
    removeAll(): void;

    get(idvalue: number): Type;
    //get_async(ids: Index[]): Promise<Type[]>;

    //set(idvalue : Index, value: Type): void 
    //set_async(ids: Index[], value: Type[]): Promise<boolean>

    events: IEventSimple<IObservableEvent<Type>>

    length() : number

    forEach(callback : IObservableForEachCallBack<Type>) : void 
    //slice(start: number, end: number): IObservableIterator<Index,Type> 
}
