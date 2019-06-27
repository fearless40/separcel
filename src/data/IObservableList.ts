import { EventSimple, IEventSimple } from "../util/EventSimple";


export interface IObservableListChangeEvent<T> {
    owner: IObservableList<T>;
    ids: number[];
    values: T[];
}

export interface IObservableIterator<T> extends Iterator<T> {

}


export interface IObservableEvents<T> {
    onChange: IEventSimple<IObservableListChangeEvent<T>>
    onErase: IEventSimple<IObservableListChangeEvent<T>>
}

export interface IObservableList<T> extends Iterable<T> {
    get(idvalue : number) : T;

    set(idvalue, value: T): void 
    set_async(ids: number[], value: T[]): Promise<boolean>

    events: IObservableEvents<T>

    length() : number

    begin(): number 
    end(): number
    range(start: number, end: number): IObservableIterator<T> 
    
}