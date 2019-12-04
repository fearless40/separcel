import { IEventSimple } from "../util/EventSimple";


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

export interface IObservable<Owner, Index, Value> {
    onChange: IEventSimple<IObservableEvent<Owner, Index, Value>>
}