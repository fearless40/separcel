import { DataView, DataTable, DataItem, DataValue, onChangeResults, DataChangedBy, EventOnChange } from "../Data"
import { Datum } from "../DataItemHelpers"
import { EventSimple } from "../../util/EventSimple"
import * as Schedule from "../sources/Schedule"
import { ScheduleOwner } from "../sources/ScheduleOwner"
import * as TS from "../sources/TimeSlot"
import { MonthHelper } from "../../util/DateHelper";
/*
 * ScheduleData event chain
 * If user modifies a value:
 * In the controller only
 *  1. Send it to Verifyier -> Accepts or stops event
 *  2. Send it to AutoFiller -> Increase the number of items filled out
 * Controller aggregates changes and sends out a DB.OnChanged event
 *  3. Send it DB
 *  4. DB broadcasts it changed
 *  5. Widget / Controller gets changed message and updates its view
 *  6. Anything else that is currently depending on the data gets notified also
 *  
 */

export const enum ScheduleSlotSpecialValues {
    ScheduleOwnerName = -1,
}

class RowCol {
    row: number
    col: number
}

export class ScheduleToTable implements DataTable {
    private mMonth: MonthHelper
    private mOwner: ScheduleOwner
    private mData: Array<Array<string>>;
    private mSlots: TS.TimeSlots;
    private mSchedule: Schedule.Schedule;

    private loadData(): void {
        this.mSchedule.loadOwner().then((value) => this.mOwner = value);
        this.mSchedule.loadEvents(this.mMonth.date_start, this.mMonth.date_end).then((value) => {
            this.mapEvents(value);
        });
        
    }

    private allocate_memory() {
        this.mData = new Array(this.maxCountRows());
        for (let r = 0; r <= this.maxCountRows(); ++r) {
            this.mData[r] = new Array<string>(this.maxCountCols());
        }
    }

    private mapEvents(events: Schedule.ScheduleEvents): void {
        this.allocate_memory();
        const data = events.data.map(this.mSlots.toIndex);

        events.data.forEach((value, index) => {
            const col = value.time_start.getDay() - 1;
            const val = value.value.display || value.value.id;
            for (let r = data[index].start; r <= data[index].end; ++r) {
                this.mData[r][col] = val;
            }
        });
    }


    constructor(tSlots: TS.TimeSlots, data : Schedule.Schedule, month : MonthHelper) {
        this.events = new EventSimple<EventOnChange>();
        this.mSlots = tSlots;
        this.mSchedule = data;
        this.mMonth= month;
        this.loadData();
    }

    private makeId(row: number, col: number): number {
        return row * this.maxCountCols() + col;
    }

    private extractRowCol(id: number): RowCol {
        let ret = new RowCol();
        ret.row = Math.floor(id / this.maxCountCols());
        ret.col = id - ret.row * this.maxCountCols();
        return ret;
    }

    maxCountRows(): number {
        return this.mSlots.maxCountRows();
    }

    maxCountCols(): number {
        return this.mMonth.days_count;
    }

    getRow(rowIndex: number): Array<DataItem> {
        let ret: DataItem[] = [];
        // Error check
        if (rowIndex >= this.maxCountRows() || rowIndex < 0) return ret;
        let that = this;

        ret = this.mData[rowIndex].map((value, index) => {
            return new Datum(value, this.makeId(rowIndex, index), that);
        });

        return ret;
    }

    getById(dataID: number): DataItem {
        if (dataID < 0) {
            switch (dataID) {
                case -1:
                    return new Datum(this.mOwner.display, -1, this);
            }
        }
        else {
            let rc = this.extractRowCol(dataID);
            return new Datum(this.mData[rc.row][rc.col], dataID, this);
        }
    }

    private value_change(id: number, value: DataValue): boolean {
        const rc = this.extractRowCol(id);
        if (rc.row > this.maxCountRows() || rc.row < 0) { return false; }
        if (rc.col > this.maxCountCols() || rc.col < 0) { return false; }
        this.mData[rc.row][rc.col] = value.toString();
        return true;
    }

    public modify(ids: number[], values: DataValue[]): onChangeResults {
        let retids = new Array<number>();
        let retvalues = new Array<DataValue>();

        for (let i = 0; i < ids.length; ++i) {
            if (this.value_change(ids[i], values[i])) {
                retids.push(ids[i]);
                retvalues.push(values[i]);
            }
        }

        this.events.fire({
            owner: <DataView>this,
            ids: retids,
            values: retvalues,
            who: [DataChangedBy.User]
        });
        return { isOk: true };
    }

    readonly events: EventSimple<EventOnChange>

} 