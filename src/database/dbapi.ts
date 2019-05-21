import { User } from "../data/models/User";
import { UserGroup } from "../data/models/UserGroups";


const enum DBConnectionType {
    Local = "local",
    Server = "server"
}

interface DBResult {
    from: DBConnectionType
    errors?: [string]
} 

interface DBSendResult extends DBResult {
    ok: boolean
}

interface DBGetResult extends DBResult {
    values: [any]
}

const enum DBCompare {
    Eq = 0,
    GEq = 1,
    GT = 2,
    LEq = 3,
    LT = 4,
    NE = 5
}

interface DBQueryField {
    field: string
    value: string
    comparison: DBCompare
}

interface DBQueryAll {
    all: boolean
}

interface DBQueryBetween {
    field: string
    min: string
    max: string
}

type DBQuery = DBQueryField | DBQueryAll | DBQueryBetween

interface DBMsgGet {
    table: string
    query: {
        by: DBQuery[]
        fields?: string[]
    }
}

interface DBMsgSend {
    table: string
    values: any[]
}

interface DataBaseConnection {
    async send(msg: DBMsgSend): Promise<DBSendResult> 
    async get(msg: DBMsgGet): Promise<DBGetResult>
}


class UsersFactory {

    constructor(private db: DataBaseConnection) {}

    async getUsers(): Promise<User[]> {
        const result = await this.db.get(
            {
                table: "user",
                query: {
                    by: [{all:true}],
                    fields: ["lastname"]
                }
            }
        });
    }

    async createUser(): Promise<User[]> {
        return [];
    }

    async updateUser(user: User): Promise<boolean> {
        return false;
    }

    async deleteUser(user: User): Promise<boolean> {
        return false;
    }

    async getGroups(): Promise<UserGroup[]> {
        return [];
    }

    async createGroup(name: string, users: User[]): Promise<UserGroup> {
        return new UserGroup();
    }



}


export class Database {
    private worker: Worker;


    users = new UsersFactory();




}