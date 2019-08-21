import { IObservableList, IObservableListChangeEvent, IObservableIterator, ChangeEventType, IObservableForEachCallBack, IObservableIndexValue } from "./IObservableList";
import { EventSimple, IEventSimple } from "../util/EventSimple";


export class ObservableArrayIterator<T>  implements IObservableIterator <number, T> {
    
    constructor(private owner: ObservableArray<T>, private begin: number, private last: number) {}

    private current(): IObservableIndexValue<number, T> {
        return {
            id: this.begin,
            value: this.owner.get(this.begin)
        };
    }

    next(value?: any): IteratorResult<IObservableIndexValue<number,T>> {

        const val = this.current(); 

        if (this.begin < this.last) {
            let ret = {
                done: false,
                value: val
            };
            this.begin += 1;
            return ret;
        }
        else {
            return {
                done: true,
                value: val
            };
        }
    }

    return?(value?: any): IteratorResult<IObservableIndexValue<number, T>> {
        return {
            done: this.begin < this.last ? false : true,
            value: this.current()
        }
    }

    throw?(e?: any): IteratorResult<IObservableIndexValue<number, T>> {
        throw new Error("Method not implemented.");
    }


}


export class ObservableArray<T>  implements IObservableList<number, T> {
    private fire_event(event_type: ChangeEventType, index: number, value: T) {
        const me = this;
        this.events.fire({
            owner: me,
            event: event_type,
            values: [value],
            ids: [index]
        });
    }

    private fire_reindex(oldindex: number, newindex: number, value: T) {
        const me = this;
        this.events.fire({
            owner: me,
            event: ChangeEventType.Reindex,
            ids: [newindex],
            oldids: [oldindex],
            value: [value]
        });
    }


    private get last_id(): number {
        return this.data.length - 1;
    }
   
    push(value: T): number {
        this.data.push(value);
        this.fire_event(ChangeEventType.Add, this.last_id, value);
        return this.last_id;
    }

    pop(): T {
        const id = this.last_id;
        const last = this.data.pop();
        this.fire_event(ChangeEventType.Remove, id, last);
        return last;
    }

    remove(index: number) {
        if (index == this.data.length - 1) {
            this.pop();
        } else {
            //Swap technique 
            const lastid = this.last_id;
            this.data[index] = this.data[lastid];

            // Fire removal event
            this.fire_event(ChangeEventType.Remove, index, this.data[lastid]);

            // Fire Reindex event
            this.fire_reindex(lastid, index, this.data[index]);
        }
    }
    removeAll(): void {
        function make_keyarray(data: T[]) {
            const ret = [];
            for (const key of data.keys()) {
                ret.push(key);
            }
            return ret;
        }

        const keys = new Array(this.data.keys());
        const ret: IObservableListChangeEvent<number, T> = {
            owner: this,
            event: ChangeEventType.Remove,
            values: this.data,
            ids: make_keyarray(this.data)
         };

        this.data = new Array();
        this.events.fire(ret);
    }

    forEach(callback: IObservableForEachCallBack<number, T>): void {
        this.data.forEach(callback);
    }

    slice(start: number, end: number): IObservableIterator<number, T> {
        throw new Error("Method not implemented.");
    }

    events: IEventSimple<IObservableListChangeEvent<number, T>>;
    private data: T[]

    

    constructor(dataArray: T[]) {
        this.data = dataArray;
        this.events = new EventSimple<IObservableListChangeEvent<number, T>>();
    }

    get(idvalue: number): T {
        return this.data[idvalue];
    }

    /*set(idvalue: any, value: T): void {
        let me = this;
        this.data[idvalue] = value;
        this.events.fire({
            owner: me,
            ids: [idvalue],
            values: [value]
        });
    }

    async set_async(ids: number[], values: T[]): Promise<boolean> {
        let me = this;
        for (let index = 0; index < ids.length; ++index) {
            this.data[ids[index]] = values[index];
        }
        this.events.onChange.fire({
            owner: me,
            ids: ids,
            values: values
        });

        return new Promise((resolve) => {
            resolve(true);
        });
    }
    */

    length(): number {
        return this.data.length;
    }

    begin() : ObservableArrayIterator<T> {
        return new ObservableArrayIterator(this, 0, this.data.length);
    }

    //end() : number {
    //    return new ObservableArrayIterator(this, this.data.length, this.data.length);
    //}

    range(start: number, end: number): ObservableArrayIterator<T> {
        return new ObservableArrayIterator(this,
            start < 0 ? 0 : start,
            end > this.data.length - 1 ? this.data.length - 1 : end
        );
    }

    [Symbol.iterator]() {
        return new ObservableArrayIterator(this, 0, this.data.length - 1);
    }


}