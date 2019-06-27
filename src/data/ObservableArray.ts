import { IObservableList, IObservableListChangeEvent, IObservableEvents, IObservableIterator } from "./IObservableList";
import { EventSimple } from "../util/EventSimple";


export class ObservableArrayIterator<T>  implements IObservableIterator < T > {
    
    constructor(private owner: ObservableArray<T>, private begin: number, private last: number) {}

    next(value?: any): IteratorResult<T> {
        if (this.begin != this.last) {
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

export class ObservableArray<T>  implements IObservableList < T > {
    events: IObservableEvents<T>;
    private data: T[]

    

    constructor(dataArray: T[]) {
        this.data = dataArray;
        this.events = {
            onChange: new EventSimple<IObservableListChangeEvent<T>>(),
            onErase: new EventSimple<IObservableListChangeEvent<T>>()
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

    begin() {
        return 0;
    }

    end() {
        return this.data.length;
    }

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