import { UserGroup } from "./UserGroups";
import { DBID, DBItem } from "../../database/dbid";

export class User implements DBItem{
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