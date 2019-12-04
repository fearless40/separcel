import { Schedule } from "../models/Schedule";
import { IDataArrayR } from "../IData";


class DateLabel implements IDataArrayR<string>{
    get(id: number): string {
        throw new Error("Method not implemented.");
    }
    length(): number {
        throw new Error("Method not implemented.");
    }
    forEach(callback: (index: number, value: string) => {}) {
        throw new Error("Method not implemented.");
    }
    [Symbol.iterator](): Iterator<import("../IData").IDataIterableReturn<number, string>> {
        throw new Error("Method not implemented.");
    }
    

    constructor(sch: Schedule) {
        
    }


}