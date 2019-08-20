import { IObservableList, IObservableListChangeEvent, IObservableEvents, IObservableIterator } from "./IObservableList";
import { EventSimple } from "../util/EventSimple";


export class ObservableArrayIterator<T>  implements IObservableIterator <number, T> {
    
    constructor(private owner: ObservableArray<T>, private begin: number, private last: number) {}

    next(value?: any): IteratorResult<T> {
        if (this.begin < this.last) {
            let ret = {
                done: false,
                value: this.owner.get(this.begin)
            };
            this.begin += 1;
            return ret;
        }
        else {
            return {
                done: true,
                value: this.owner.get(this.begin)
            };
        }
    }

    return?(value?: any): IteratorResult<T> {
        return {
            done: this.begin < this.last ? false : true,
            value: this.owner.get(this.begin)
        }
    }

    throw?(e?: any): IteratorResult<T> {
        throw new Error("Method not implemented.");
    }


}

export class ObservableArray<T>  implements IObservableList<number, T> {
    private fire_onchange(index: number, value: T) {
        const me = this;
        this.events.onChange.fire({
            owner: me,
            values: [value],
            ids: [index]
        });
    }

    private fire_onerase(index: number, oldvalue : T) {
        const me = this;
        this.events.onErase.fire({
            owner: me,
            values: [oldvalue],
            ids: [index]
        });
    }

    private fire_onadd(index: number, value: T) {
        const me = this;
        this.events.onAdd.fire({
            owner: me,
            values: [value],
            ids: [index]
        });
    }

    push(value: T): number {
        this.data.push(value);
        this.fire_onadd(this.data.length - 1, value);
    }

    pop(): T {
        const id = this.data.length - 1;
        const last = this.data.pop();
        this.fire_onerase(id, last);
        return last;
    }

    remove(index: number) {
        if (index == this.data.length - 1) {
            this.pop();
        } else {
            const oldvalue = this.data[index];
            const new_value = this.data.slice(0, index - 1);
            new_value.concat(this.data.slice(index + 1));
            this.fire_onerase(index, oldvalue);
            this.data = new_value;
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
            values: this.data,
            ids: keys
         };

        this.data = new Array();
        this.events.onErase(ret);
    }
    forEach(callback: import("./IObservableList").IObservableForEachCallBack<number, T>): void {
        throw new Error("Method not implemented.");
    }
    slice(start: number, end: number): IObservableIterator<number, T> {
        throw new Error("Method not implemented.");
    }
    events: IObservableEvents<number, T>;
    private data: T[]

    

    constructor(dataArray: T[]) {
        this.data = dataArray;
        this.events = {
            onChange: new EventSimple<IObservableListChangeEvent<number, T>>(),
            onErase: new EventSimple<IObservableListChangeEvent<number, T>>(),
            onAdd: new EventSimple<IObservableListChangeEvent<number, T>>()
        };
    }

    get(idvalue: number): T {
        return this.data[idvalue];
    }

    set(idvalue: any, value: T): void {
        let me = this;
        this.data[idvalue] = value;
        this.events.onChange.fire({
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

    [Symbol.iterator](): Iterator<T> {
        return new ObservableArrayIterator(this, 0, this.data.length - 1);
    }


}