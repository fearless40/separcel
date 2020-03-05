import { EventDefinition, EventGroup } from "./EventGroup";
import { ScheduleOwner } from "./ScheduleOwner";
import { TimeSlots } from "./TimeSlot";
import { DataTable, DataItem, DataValue } from "../Data";
import { User } from "./User";
import { ScheduleDefinition, ScheduleDataDefinition } from "./ScheduleDefinition";
import { ScheduleStream } from "./ScheduleStream";
import { ScheduleDataSnapShot } from "./ScheduleDataSnapShot";
import { SubSchedule } from "./SubSchedule";
import { DbItem } from "../../database/dbapi";
import { DateDiffDays } from "../../util/DateHelper";

// Possible Table Format for a schedule
// Versions -> ScheduleVersion
// Schedule -> Everything but ScheduleVersion 
// SubSch -> Holds the subschedules for all the schedules
// SchStream -> Holds the stream changes for all the schedules


export class ScheduleVersion {
    id: number
    token: number
    exported: boolean
    date_exported: Date
    export_format: string
    exported_by: User
    notes: string
}


export class Schedule implements DbItem {
    id: string
    server_id: string
    isSavetoDB: boolean
    schedulegroup: string
    date_start: Date
    date_end: Date
    subSchs: SubSchedule[]
    //data: ScheduleStream

    //constructor(month: number, year: number, template : any);
    //constructor(startdate: Date, enddate: Date, template : any);
    //constructor()



    get nbrDays() : number {
        return DateDiffDays(this.date_start, this.date_end);
    }

    /// When a value changes in a SubSch it calls register_change to let the Schedule know the
    /// value changed
    register_change(subSch: SubSchedule, index: any, value: string): void {
        /// If the scheduled is saved to the db then will issues an update command to the database
    }

    load(criteria: any) {
        /// Loads from the database
    }

    save() {
        /// Saves the schedule and version to the database. 
        /// Only needed to be called on creation / import. 
        /// assigns server_id at that time
    }

    import(data: any) {
        /// imports from json need to call save
    }

    versions(): ScheduleVersion[] {
        return []
    }

    version_create(): Schedule {
        return;
    }
}










