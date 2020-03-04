import { ScheduleStream } from "./ScheduleStream";
import { User } from "./User";
import { TimeSlots } from "./TimeSlot";



/*export class ScheduleTemplate {
    id: string
    subschedules: Array<SubScheduleTemplate>
    subScheduleViewOrder: Array<number>

}*/

export class SubSchedule {
    display: string
    timeSlots: TimeSlots;
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
    subschedules: Array<SubSchedule>
    versions: Array<Schedule>
    datastream: ScheduleStream
    meta: MetaData



    /*
     * template
     * subschedules
     * datastream
     * metadata
     * /
};