import { User } from "../data/models/User";
import { UserGroup } from "../data/models/UserGroups";

class UsersFactory {
    async getUsers(): Promise <User[]> {
        return [];
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