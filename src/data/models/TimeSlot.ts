import { DataTable, DataItem } from "../Data";
import { Datum } from "../ItemHelpers";

export class TimeSlotEntry implements Properties {
    time_start: Date
    time_end: Date
    display: string
    constructor(timeStart: Date, timeEnd: Date, display: string) {
        if (timeStart < timeEnd) {
            this.time_end = this.time_end;
            this.time_start = this.time_start;
            this.display = display;
        }
    }

    getProperty(id: string): Property {
        return { id: "yo", value: "no" };
    }
}

export interface TimeSlotIndex {
    start: number
    end: number
}

export class TimeSlots implements DataTable {
    readonly id: string
    name: string
    description: string
    slots: Array<TimeSlotEntry> //are sorted by timestart

    constructor(slots: Array<TimeSlotEntry>) {
        this.slots = slots;
    }

    save(): Promise<boolean> {
        return new Promise<boolean>( ()=> true);
    }

    maxCountRows(): number {
        return this.slots.length - 1;
    }
    maxCountCols(): number {
        return 1;
    }

    getRow(rowIndex: number): Array<DataItem> {
        return [this.getById(rowIndex)];
    }

    getById(dataID: number): DataItem {
        return new Datum(this.slots[dataID].display, dataID, this);
    }

    toIndex(time_start : Date, duration : number): TimeSlotIndex {
        const start = time_start;
        const end = new Date(time_start)
        end.setMinutes(start.getMinutes() + duration);

        const startindex = this.slots.findIndex((element) => (start >= element.time_start && start < element.time_end));
        const endindex = this.slots.findIndex((element) => (end > element.time_start && end <= element.time_end));

        return { start: startindex, end: endindex };
    }

}