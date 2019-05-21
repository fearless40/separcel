import { UserGroup } from "./UserGroups";

export class User {
    private name: string
    private isLoggedin: boolean
    private loginToken: string
    private expiresToken: Date
    private usergroups : UserGroup[]


    getName(): string {
        return this.name;
    }


}