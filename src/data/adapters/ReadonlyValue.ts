import { IDataTableR, IDataArrayR, IDataTableIndex, IDataIterableReturn, IDataTablePosition } from "../IData"

class ReadonlyValue implements IDataTableR<number, string> {
    constructor(private value: string) {

    }


    rowCount(): number {
        return 1;
    }    colCount(): number {
        return 1;
    }
    getRow(row: number): IDataArrayR<string> {
        throw new Error("Method not implemented.");
    }
    getCol(col: number): IDataArrayR<string> {
        throw new Error("Method not implemented.");
    }
    get(id: IDataTableIndex<number>): string {
        return this.value;
    }
    length(): number {
        return 1;
    }
    forEach(callback: (index: IDataTableIndex<number>, value: string) => {}) {
        callback(0, this.value);
    }
    [Symbol.iterator](): Iterator<IDataIterableReturn<IDataTableIndex<number>, string>> {
        let next_func = () => { return { done: true, value: this.value } };

        return {
            next: next_func,
            
        }
    }


}