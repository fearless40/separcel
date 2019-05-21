import { DataItem, DataView, DataValue, NullOwner } from "./Data"


export class ReadonlyDataItem implements DataItem {
    constructor(public readonly value: string) {

    }

    get id() {
        return 0;
    }

    get owner() {
        return NullOwner.NullOwner;
    }

}


export class Datum implements DataItem {
    constructor(public readonly value: DataValue, public readonly id: number, public readonly owner: DataView) {}
}