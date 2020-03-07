import { DBItem } from "../../database/dbapi";
import { DateDiffDays } from "../../util/DateHelper";
import { SubSchedule } from "./SubSchedule";


export class ScheduleVersion {
    stream_token: number
    date_created: Date
    date_lastedit: Date
    //created_by: User
    notes: string
}

/// Domain Object
export class Schedule implements DBItem {
    dbid: DBItem
    server_id: string
    schedulegroup: string
    date_start: Date
    date_end: Date
    version: ScheduleVersion
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


    import(data: any) {
        /// imports from json
    }

    versions(): ScheduleVersion[] {
        return []
    }

    version_create(): Schedule {
        return;
    }
}










