import { IDataTableRW, IDataTableIndex } from "../IData";
import { TimeSlots } from "./TimeSlot";
import { Array2D } from "../../util/Array2D";
import { Schedule } from "./Schedule";


/// Stores the schedule in col order (so each timeslot is sequential)
/// Ex:
/// TimeSlots = 3 slots, 2 days of data
/// data = d1_t1, d1_t2, d1_t3, d2_t1, d2_t2, d3_t3
/// vs row fmt
/// data = d1_t1, d2_t1, d1_t2, d2_t2, d1_t3, d2_t3
export class SubSchedule implements IDataTableRW<number, string> {
    
    readonly id: string
    private display: string
    private timeSlots: TimeSlots;
    private data: Array2D<string>
    private owner: Schedule;

    constructor(id : string, owner : Schedule, timeslots : TimeSlots) {
        this.id = id;
        this.owner = owner;
        this.data = new Array2D<string>(owner.nbrDays, timeslots.length());
        this.timeSlots = timeslots;

    }

    timeslots_get() {
        return this.timeSlots;
    }

    row_set(row: number, data: string[]): void {
        throw new Error("Method not implemented.");
    }
    col_set(col: number, data: string[]): void {
        throw new Error("Method not implemented.");
    }

    private _set(row: number, col: number, val: string) {
        this.data.set(row, col, val);
        this.owner.register_change(this, this.data.toIndex(row, col), val);
    }

    //set(row: number, col: number, data: string): void;
    //set(IDataTableIndex<number>, data: string): void;
    set(row: any, col: any, value?: any) {
        if (typeof col === "number") {
            // Using the row, col format
            this._set(row, col, value);
            return;
        }

        if ("row" in row) {
            this._set(row.row, row.col, col);
            return;
        }

        if (typeof row === "number" && typeof col === "string") {
            const index = this.data.decodeIndex(row);
            this._set(index.row, index.col, value);
            return;
        }
    }

    
    row_length(): number {
        return this.data.row_length;
    }
    col_length(): number {
        return this.data.col_length;
    }
    row_get(row: number): string[] {
        throw new Error("Method not implemented.");
    }
    col_get(col: number): string[] {
        throw new Error("Method not implemented.");
    }
    //get(row: number, col: number): string;
    //get(id: number): string;
    get(row: any, col?: any) {
        if (col) {
            return this.data.get(row, col);
        } else {
            const index = this.data.decodeIndex(row);
            return this.data.get(index.row, index.col);
        }
    }
    length(): number {
        return this.data.data.length;
    }
    forEach(callback: (value: string, index: import("../IData").IDataTableIndex<number>) => void) {
        throw new Error("Method not implemented.");
    }
    toArray(): string[] {
        return this.data.data;
    }
    [Symbol.iterator](): Iterator<import("../IData").IDataIterableReturn<import("../IData").IDataTableIndex<number>, string>, any, undefined> {
        throw new Error("Method not implemented.");
    }



    


}
