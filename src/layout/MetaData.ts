import {LayoutItem} from "./Layout"
import { LayoutTable } from "./Table"
import {DataItem} from "../data/Data"
import {Cell2d, Cell, CellSimple} from "./Cell"
import { TableRange } from "./Helpers";

export const enum MetaTypes {
    Header,
    Body,
    Footer,
    Columns,
    Rows,
    Caption,
    RowHeader
}

export const enum Markers {
    Start,
    End
}

export interface MetaLayout extends LayoutItem {
    toGrid(): Cell2d;
    range: TableRange;
    type: MetaTypes;
}

export function SearchForPseudoElements(values: Cell2d) : Set<MetaLayout> {
    let ret = new Set<MetaLayout>();
    for (let row = 0; row < values.length; ++row) {
        for (let col = 0; col < values[0].length; ++col) {
            let c = values[row][col];
            if (c instanceof CellMarked) {
                c.marks.forEach((value) => {
                    if (value.position == Markers.Start) {
                        value.owner.range.row_start = row;
                        value.owner.range.col_start = col;
                    }
                    else {
                        value.owner.range.row_end = row;
                        value.owner.range.col_end = col;
                        ret.add(value.owner);
                    }
                });
            }
        }
    }
    return ret;
}

interface MarkInstance {
    position: Markers,
    owner: MetaLayout
}

export class CellMarked implements Cell {
    public rowspan: number
    public colspan: number
    public data: DataItem
    public isReadOnly: boolean

    constructor(cell: CellSimple | CellMarked, markerPosition: Markers, markOwner: MetaLayout) {
        this.rowspan = cell.rowspan;
        this.colspan = cell.colspan;
        this.data = cell.data;
        this.isReadOnly = cell.isReadOnly;
        this.cssClasses = cell.cssClasses;

        if (cell instanceof CellMarked) {
            this.marks = cell.marks;
        }
        else {
            this.marks = [];
        }
        this.marks.push({ position: markerPosition, owner: markOwner });
    }

    isEmpty(): boolean {
        return (this.rowspan <= 0 || this.colspan <= 0);
    }

    public cssClasses: string[] = [];
    public marks: MarkInstance[];
}




export class MetaItem implements MetaLayout {
    range: TableRange = new TableRange(-1, -1, -1, -1);

    constructor(private item: LayoutItem, readonly layoutType: MetaTypes) {

    }

    get type() : MetaTypes {
        return this.layoutType;
    }

    toGrid(): Cell2d {
        const values = this.item.toGrid();
        values[0][0] = new CellMarked(values[0][0], Markers.Start, this);

        const lastRow = values.length - 1;
        const lastCol = values[0].length - 1;

        values[lastRow][lastCol] = new CellMarked(values[lastRow][lastCol], Markers.End, this);

        return values;
    }
}
