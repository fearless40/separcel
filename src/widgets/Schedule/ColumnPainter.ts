import { MetaItem, MetaTypes } from "../../layout/MetaData";
import { Painter, PaintInformation, PainterCallback } from "./Painter";
import { LayoutItem, Wrapper } from "../../layout/Layout";
import { DataTable } from "../../data/Data";
import { Cell2d } from "../../layout/Cell";



export class ColumnPainter extends MetaItem implements Painter {

    private data: DataTable;

    constructor(item: DataTable, private cb: PainterCallback) {
        super(new Wrapper(item), MetaTypes.Columns);
        this.data = item;
    } 

    paint(element: HTMLElement, info: PaintInformation) {
        info.owner = this.data;
        this.cb(element, info);
    }

    toGrid(): Cell2d {
        return super.toGrid();
    }
}