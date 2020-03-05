import { EventDefinition, EventGroup } from "./EventGroup";
import { ScheduleOwner } from "./ScheduleOwner";
import { TimeSlots } from "./TimeSlot";
import { DataTable, DataItem, DataValue } from "../Data";
import { User } from "./User";
import { ScheduleDefinition, ScheduleDataDefinition } from "./ScheduleDefinition";
import { ScheduleStream } from "./ScheduleStream";
import { ScheduleDataSnapShot } from "./ScheduleDataSnapShot";
import { SubSchedule } from "./SubSchedule";




export class ScheduleVersion {
    id: number
    token: number
    exported: boolean
    date_exported: Date
    export_format: string
    exported_by: User
    notes: string
}


export class Schedule {
    id: string
    date_start: Date
    date_end: Date
    subSchs: SubSchedule[]
    data: ScheduleStream

    get nbrDays() : number {
        return (this.date_end.getTime() - this.date_start.getTime()) / (1000 * 60 * 60 * 24);
    }

    /// When a value changes in a SubSch it calls register_change to let the Schedule know the
    /// value changed
    register_change(subSch: SubSchedule, index: any, value: string): void {

    }
}










