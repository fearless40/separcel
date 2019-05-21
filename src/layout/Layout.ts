import * as DV from "../data/Data"
import { Cell, Cell2d, MaxColumns, CellSimple  } from "./Cell"
import { DataTable } from "../data/Data";


export interface LayoutItem {
   toGrid(): Cell2d
}

export const enum LayoutPosition {
    Last = -1,
    First = 0,
    Specify = 255
}


export class Wrapper implements LayoutItem {
    toGrid(): Cell2d {
        let ret = new Array<Array<Cell>>(this.mDataTable.maxCountRows());

        for (let i = 0; i < this.mDataTable.maxCountRows(); ++i) {
            let row = this.mDataTable.getRow(i);
            ret[i] = row.map<Cell>(function (value: DV.DataItem) : Cell {
                return new CellSimple(value);
            });
        }
        return ret;
    }

    constructor(private mDataTable: DV.DataTable) {
 
    }
    
}


function isDataTable(item: DataTable | LayoutItem): item is DataTable {
    return (<DataTable>item).getRow !== undefined;
}

function isLayoutItem(item: DataTable | LayoutItem): item is LayoutItem {
    return (<LayoutItem>item).toGrid !== undefined;
}

export function WrapperHelper(item: DataTable | LayoutItem): LayoutItem {
    if (isLayoutItem(item)) {
        return item;
    }
    else {
        return new Wrapper(item);
    }
}


function AddLayout(LayoutArray: LayoutItem[], item: LayoutItem, position: LayoutPosition, specific_position?: number) : number {
    switch (position) {
        case LayoutPosition.Last:
            LayoutArray.push(item);
            return LayoutArray.length - 1;
        case LayoutPosition.First:
            LayoutArray.unshift(item);
            return 0;
        case LayoutPosition.Specify:
            if (specific_position == undefined || specific_position > LayoutArray.length || specific_position < 0) {
                LayoutArray.push(item)
                return LayoutArray.length - 1;
            }
            else {
                LayoutArray.splice(specific_position, 0, item);
                return specific_position;
            }
    }
}


export class Horizontal implements LayoutItem{
    addDataTable(datatable: DV.DataTable, position : LayoutPosition = LayoutPosition.Last, specific_position? : number): number {
        return this.addLayout(new Wrapper(datatable), position, specific_position);
    }

    addLayout(layoutitem: LayoutItem, position: LayoutPosition = LayoutPosition.Last, specific_position?: number) : number {
        return AddLayout(this.mLayouts, layoutitem, position, specific_position);
    }

    adjustRowspan(adjust: Cell2d, comparelength: number): void {
        let rowIndex = adjust.length - 1;
        let rowSpan = (comparelength - adjust.length) + 1; // +1 as rowspan of 1 is normal, therefore need to increase by 1
        for (let colIndex = 0; colIndex < adjust[rowIndex].length; ++colIndex) {
            adjust[rowIndex][colIndex].rowspan = rowSpan;
        }
    }

    addEmptyRows(adjust: Cell2d, comparelength: number): void {
        let emptycol = new Array<Cell>();
        emptycol.length = adjust[0].length;
        // Create blank array of values
        for (let colIndex = 0; colIndex < adjust[0].length; ++colIndex) {
            emptycol[colIndex] = CellSimple.EmptyCell;
        }

        //Set the blank array to each row that is not equal
        for (let rowIndex = 0; rowIndex < comparelength - adjust.length; ++rowIndex) {
            adjust.push(emptycol)
        }
    }

    toGrid(): Cell2d {
        let last = this.mLayouts[0].toGrid();
        for (let i = 1; i < this.mLayouts.length; ++i) {
            let nextGroup = this.mLayouts[i].toGrid();
            if (this.autoExpand && last.length < nextGroup.length) {
                // Need to adjust the rowspan of the last item to meet the values
                this.adjustRowspan(last, nextGroup.length);
            }
            this.addEmptyRows(last, nextGroup.length) //Always need to pad the rows with empty cells to allow the following to work. 
            for (let r = 0; r < last.length; ++r) {
                if (this.borderBetweenDivisions) {
                    last[r][last[r].length - 1].cssClasses.push("cell-right-border-divison");
                    nextGroup[r][0].cssClasses.push("cell-left-border-divison");
                }
                last[r] = last[r].concat(nextGroup[r]);
            }
        }
        
        if( this.isHeader ) {
            last.forEach( (value) => {
                value.forEach( (cell) => cell.isReadOnly = true );
            });
        }

        return last;
    }

    private mLayouts : Array<LayoutItem> = []

    //public isHeaderLike = false; //Set to true tends to make the item always visible
    //public autoExpand = true; //Set to true to change the colspan rather than generate empty cells
    constructor(public isHeader: boolean = false, public autoExpand: boolean = true) {

    }

    public borderBetweenDivisions: boolean = false;

}

export class Vertical implements LayoutItem{
    addDataTable(datatable: DV.DataTable, position: LayoutPosition = LayoutPosition.Last, specific_position?: number): number {
        return this.addLayout(new Wrapper(datatable), position, specific_position);
    }

    addLayout(layoutitem : LayoutItem, position: LayoutPosition = LayoutPosition.Last, specific_position?: number) : number {
        return AddLayout(this.mLayouts, layoutitem, position, specific_position);
    }

    addEmptyCols(adjust: Cell[], nbrToAdd: number): void {
        for (let i = 0; i < nbrToAdd; ++i) {
            adjust.push(CellSimple.EmptyCell);
        }
    }


    toGrid(): Cell2d {
        let grids = new Array<Cell2d>();
        let max_col: number = 0;

        // Figure out the max col size
        this.mLayouts.forEach((layout) => {
            const cells = layout.toGrid();
            max_col = Math.max(max_col, MaxColumns(cells));
            grids.push(cells);
        });

        grids.forEach((cells) => {
            for (let row = 0; row < cells.length; ++row) {
                let tempRow = cells[row];
                if (tempRow.length < max_col) {
                    if (this.autoExpand) {
                        tempRow[tempRow.length - 1].colspan = max_col - tempRow.length;
                    }
                    this.addEmptyCols(tempRow, max_col - tempRow.length);
                }
            }
        });

        // Todo: Merge the values in grid into one array
        let ret = grids.reduce((acc, cur) => {
            if (this.borderBetweenDivisions) {
                acc[acc.length - 1].forEach((value) => value.cssClasses.push("cell-bottom-border-divison"));
                cur[0].forEach((value) => value.cssClasses.push("cell-top-border-divison"));
            }
            return acc.concat(cur);
        });


        
         if( this.isHeader ) {
            ret.forEach( (value) => {
                value.forEach( (cell) => cell.isReadOnly = true );
            });
        }

        return ret;
    }

    private mLayouts: LayoutItem[] = [];
    public borderBetweenDivisions: boolean = false;

    //public isHeaderLike = false; //Set to true tends to make the item always visible
    //public autoExpand = true; //Set to true to change the colspan rather than generate empty cells
    constructor(public isHeader: boolean = false, public autoExpand: boolean = true) {

    }
}

