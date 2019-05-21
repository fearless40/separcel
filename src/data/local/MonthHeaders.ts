import { DataTable, DataItem } from "../Data"
import { ReadonlyDataItem } from "../ItemHelpers"
import { MonthHelper } from "../../util/DateHelper";


export class MonthLabel implements DataTable{
    constructor(private month: number) {

    }
        
    maxCountRows(): number {
        return 1;
    }

    maxCountCols(): number {
        return 2;
    }

    getRow(rowIndex: number): Array<DataItem> {
        return [this.getById(0), this.getById(1)]
    }

    getById(dataID: number): DataItem{
        switch (dataID) {
            case 0:
                let d = new Date();
                d.setMonth(this.month - 1);
                return new ReadonlyDataItem(d.toLocaleDateString("en", { month: "long", year: "numeric" }));
            case 1:
                return new ReadonlyDataItem("GRID")
        }
    }

}

export const enum MonthDaysFormat {
    Number,
    ShortText,
    LongText
}

export class MonthDaysLabels implements DataTable {
    private monthInfo : MonthHelper

    constructor(month: number, year: number, private fmt : MonthDaysFormat) {
        this.monthInfo = new MonthHelper(month, year);
    }
    
    maxCountRows(): number {
        return 1;
    }

    maxCountCols(): number {
        return this.monthInfo.days_count ;
    }

    getById(id: number): DataItem {
        switch (this.fmt) {
            case MonthDaysFormat.Number:
                return new ReadonlyDataItem(id.toString());
            case MonthDaysFormat.ShortText:
                return new ReadonlyDataItem(this.monthInfo.day_name_short(id));
            case MonthDaysFormat.LongText:
                return new ReadonlyDataItem(this.monthInfo.day_name_long(id));
        }
    }

    getRow(rowIndex: number): Array<DataItem> {
        if (rowIndex != 0) {
            return [];
        }

        let ret = new Array<DataItem>(this.maxCountCols());
        for (let i = 0; i < this.monthInfo.days_count; ++i) {
            ret[i] = this.getById(i+1);
        }
        return ret;
    }

}


