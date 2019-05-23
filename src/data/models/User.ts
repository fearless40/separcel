import { UserGroup } from "./UserGroups";
import { DBID } from "../../database/dbid";

export class User {
    dbid : DBID

    private name: string
    private isLoggedin: boolean
    private loginToken: string
    private expiresToken: Date
    private usergroups : UserGroup[]



    getName(): string {
        return this.name;
    }


}