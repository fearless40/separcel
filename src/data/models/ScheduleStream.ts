import { Schedule, ScheduleVersion } from "./Schedule";
import { ScheduleDataSnapShot } from "./ScheduleDataSnapShot";
import { ScheduleDataDefinition } from "./ScheduleDefinition";
import { User } from "./User";

class CellData {
    snapshotid: number
    value: string
}

interface ScheduleStreamEntry {
    data: Array<CellData>
    data_source: ScheduleDataDefinition
    user?: User
}

export class ScheduleStream {
    schedule: Schedule
    data: Array<ScheduleStreamEntry>

    buildSnapShots(version: ScheduleVersion): Array<ScheduleDataSnapShot> {
        return [];
    }

    getSchedule(): Schedule {
        return this.schedule;
    }

    add_change(datadef: ScheduleDataDefinition, value: string[]) : void {

    }

    undo_change(): void {

    }

    

    //fork() //Saves the existing stream, creates a new stream at the location allowing one to edit multiple
             // streams of data at once. Kind of creates an internal version control allowing one to merge the different changes



    
}