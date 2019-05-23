import { UserGroup } from "../data/models/UserGroups";
import { User } from "../data/models/User";
import { DBSendAction, DataBaseConnection } from "./dbmsg";
import { DBID } from "./dbid";

export interface SmallUser {
    dbid: DBID
    name: string
}

export class UsersFactory {

    constructor(private db: DataBaseConnection) { }

    async getUsers(): Promise<SmallUser[]> {
        const result = await this.db.get(
            {
                table: "user",
                query: {
                    by: [{ all: true }],
                    fields: ["name"]
                }
            });
        return [];
    }

    private async userActions(user: User, action: DBSendAction): Promise<User> {
        const result = await this.db.send(
            {
                table: "user",
                action: action,
                values: [user]
            });

        if (result.ok) {
            user.dbid = result.dbid
            return user;
        } else {
            throw new Error("Database error");
        }
    }

    async createUser(user: User): Promise<User> {
        return this.userActions(user, DBSendAction.Create);
    }

    async updateUser(user: User): Promise<boolean> {
        return this.userActions(user, DBSendAction.Update).then(() => true);
    }

    async deleteUser(user: User): Promise<boolean> {
        return this.userActions(user, DBSendAction.Delete).then(() => true);
    }

    async getGroups(): Promise<UserGroup[]> {
        return [];
    }

    async createGroup(name: string, users: User[]): Promise<UserGroup> {
        return new UserGroup();
    }

}
