import { ScheduleStream } from "./ScheduleStream";
import { User } from "./User";
import { TimeSlots } from "./TimeSlot";


export class SubScheduleTemplate {
    id: number
    display: string
    timeSlots: TimeSlots;
}

export class ScheduleTemplate {
    id: string
    subschedules: Array<SubScheduleTemplate>
    subScheduleViewOrder: Array<number>

}

export class SubSchedule {
    template: SubScheduleTemplate;
    data: Array<string>

    

    value(row: number, col: number): string {
        return "";
    }

    setValue(row: number, col: number, val: string) {

    }


}

export class MetaData {
    dateCreated: Date
    dateEdited: Date
    LastEditedBy: User
}

export class Schedule {
    template: string
    subschedules: Array<SubSchedule>
    subscheduleOrder: Array<number>
    versions: Array<ScheduleVersion>
    datastream: ScheduleStream
    meta: MetaData

    /*
     * template
     * subschedules
     * datastream
     * metadata
     * /
}