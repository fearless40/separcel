import { DataTable, DataItem, DataValue } from "../Data";
import { ScheduleStream } from "./ScheduleStream";
import { ScheduleDataDefinition } from "./ScheduleDefinition";


export class ScheduleDataSnapShot implements DataTable {
    makeId(row: number, col: number): number {
        if (row < 0 || row > this.maxCountRows()) {
            throw new Error("Invalid Row data");
        }
        if (col < 0 || col > this.maxCountCols()) {
            throw new Error("Invlid Col size");
        }

        return (row * this.maxCountRows()) + col;
    }
    maxCountRows(): number {
        return this.data_def.time_slots.maxCountRows();
    }
    maxCountCols(): number {
        return this.stream.getSchedule().getNbrDays();
    }
    getRow(rowIndex: number): DataItem[] {
        throw new Error("Method not implemented.");
    }
    getById(dataID: number): DataItem {
        throw new Error("Method not implemented.");
    }
    modify?(ids: number[], values: DataValue[]): import("../Data").onChangeResults {
        throw new Error("Method not implemented.");
    }
    events?: import("../../util/EventSimple").EventSimple<import("../Data").EventOnChange>;


    private data: Array<string>
    private data_def: ScheduleDataDefinition
    private stream: ScheduleStream
}
