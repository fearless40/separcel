import { DataTable, DataItem } from "../Data";
import { Datum } from "../ItemHelpers";
import { IDataListRW, IDataIterableReturn, IDataListR } from "../IData";
import { Array_Remove } from "../../util/ArrayHelper";

export class TimeSlotEntry {
    time_start: Date
    time_end: Date
    display: string
    order: number
    constructor(display: string, order: number, timeStart?: Date, timeEnd?: Date) {
        this.display = display;
        this.order = order;
        if (timeStart && timeEnd) {
            if (timeStart < timeEnd) {
                this.time_end = this.time_end;
                this.time_start = this.time_start;

            }
        }
    }
}



/*export interface TimeSlotIndex {
    start: number
    end: number
}*/

export class TimeSlots implements IDataListRW<number, TimeSlotEntry> {

    readonly id: string
    name: string
    description: string
    slots: Array<TimeSlotEntry> //are sorted by order
    
    private sort() {
        this.slots.sort((a, b) => a.order - b.order);
    }

    add(value: TimeSlotEntry | IDataListR<number, TimeSlotEntry> | TimeSlotEntry[]): number | number[] {
        if (value instanceof TimeSlotEntry) {
            this.slots.push(value);
            this.sort();
            return this.slots.findIndex((item) => item.order === value.order);
        }

        let arr: TimeSlotEntry[];

        // Narrow to IDataList
        if ("toArray" in value) {
            arr = value.toArray();
        }

        // Narrow to Array
        if ("concat" in value) {
            arr = value;
        }

        // Now Process an array
        this.slots.concat(arr);
        this.sort();

        let ret = new Array<number>();

        arr.forEach((value) => {
            ret.push(this.slots.findIndex((item) => item.order === value.order));
        });

        return ret;
    }

    toArray(): TimeSlotEntry[] {
        return this.slots;
    }

    remove(id: number): TimeSlotEntry {
        //Swaps the item out
        return Array_Remove(this.slots, id);
    }

    set(id: number, value: TimeSlotEntry): void {
        if (id >= this.slots.length || id < 0 ) return;
        this.slots[id] = value;
    }
    get(id: number): TimeSlotEntry {
        if (id >= this.slots.length || id < 0) {
            throw new Error("Out of array bounds");
        }
        return this.slots[id];
    }
    length(): number {
        return this.slots.length;
    }
    forEach(callback: (value: TimeSlotEntry, index: number ) => void) {
        this.slots.forEach(callback)
    }
    [Symbol.iterator](): Iterator<IDataIterableReturn<number, TimeSlotEntry>, any, undefined> {
        throw new Error("Method not implemented.");
    }
    
    constructor(slots: Array<TimeSlotEntry>) {
        this.slots = slots;
        
    }
   

    /*toIndex(time_start : Date, duration : number): TimeSlotIndex {
        const start = time_start;
        const end = new Date(time_start)
        end.setMinutes(start.getMinutes() + duration);

        const startindex = this.slots.findIndex((element) => (start >= element.time_start && start < element.time_end));
        const endindex = this.slots.findIndex((element) => (end > element.time_start && end <= element.time_end));

        return { start: startindex, end: endindex };
    }*/

}