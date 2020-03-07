import { User } from "./User";


export class ResourceCreationMeta {
    date_created: Date
    created_by: User
}

export class ResourceEditedMeta {
    date_edited: Date
    edited_by: User
}

