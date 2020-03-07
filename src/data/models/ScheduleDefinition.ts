import { ScheduleOwner } from "./ScheduleOwner";
import { EventGroup } from "./EventGroup";
import { TimeSlots } from "./TimeSlot";
import { User } from "./User";
import { UserGroup } from "./UserGroups";



export class ScheduleDataDefinition {
    owner_user: ScheduleOwner
    event_group: EventGroup
    time_slots: TimeSlots
}

export class ScheduleDefinition {
    name: string
    author: User
    groups_readonly: UserGroup[]
    groups_edit: UserGroup[]
    created_date: Date
    //data_sources: Array<ScheduleDataDefinition>
    data_layout: any
}
