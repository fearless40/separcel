import { EventDefinition, EventGroup } from "./EventGroup";
import { ScheduleOwner } from "./ScheduleOwner";
import { TimeSlots } from "./TimeSlot";
import { DataTable, DataItem, DataValue } from "../Data";
import { User } from "./User";
import { ScheduleDefinition, ScheduleDataDefinition } from "./ScheduleDefinition";
import { ScheduleStream } from "./ScheduleStream";
import { ScheduleDataSnapShot } from "./ScheduleDataSnapShot";




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
    id: number
    date_start: Date
    date_end: Date
    definition: ScheduleDefinition
    versions: ScheduleVersion[]
    data: ScheduleStream
    snapshots: Map<ScheduleDataDefinition, ScheduleDataSnapShot>

    getNbrDays(): number {
        return 10;
    }
}










