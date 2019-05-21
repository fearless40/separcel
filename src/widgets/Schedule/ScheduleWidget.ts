import { DataItem, DataView, EventOnChange, DataChangedBy} from "../../data/Data";
import { Datum, ReadonlyDataItem } from "../../data/ItemHelpers";
import { LayoutTable } from "../../layout/Table";
import { MetaTypes } from "../../layout/MetaData";
import { TableRange } from "../../layout/Helpers";
import { Cell2d } from "../../layout/Cell";
import { PaintInformation, Painter } from "Painter"
import { ColumnPainter } from "./ColumnPainter";
import { RowPainter } from "./RowPainter";

class ColItem {
    constructor() {}
    node: HTMLElement
    value: string = ""
    rowspan: number = 0
    colspan: number = 0
    isEmpty:boolean = true
}

export const enum SWAttributes {
    RowIndex = "data-row",
    ColIndex = "data-col",
    Rowspan = "rowspan",
    Colspan = "colspan"
};    

const enum CssSelection {
    TopBorder = "schedule-select-top",
    BottomBorder = "schedule-select-bottom",
    LeftBorder = "schedule-select-left",
    RightBorder = "schedule-select-right",
    Selected = "schedule-select"
}

export interface ScheduleWidgetID {
    row: number
    col: number
};

export class ScheduleCellID implements ScheduleWidgetID{
    constructor(public row: number, public col: number) { }
    get isValid() : boolean {
        return !isNaN(this.row) || !isNaN(this.col);
    }
}

export interface ScheduleWidgetCellInfo {
    id: ScheduleCellID 
    data: DataItem
}

class HtmlCell {
    constructor( element : HTMLElement, data : DataItem ) {
        this.mElement = element;
        this.id = data.id;
        this.owner = data.owner;
    }
    
    private mElement : HTMLElement;

    get element(): HTMLElement {
        return this.mElement;
    }
    readonly id: number;
    readonly owner: DataView;
}

type HTMLCells = Array<Array<HtmlCell>>
type NumberToCell = Map<number, HtmlCell>;
type OwnerToCellMap = Map<DataView, NumberToCell>

interface SelectionCellCB {
    (id: ScheduleWidgetID): void;
}

class Selection {
    private mRow_start: number;
    private mRow_end: number;
    private mCol_start: number;
    private mCol_end: number;

    get row_start() { return this.mRow_start; }
    get row_end() { return this.mRow_end; }
    get col_start() { return this.mCol_start; }
    get col_end() { return this.mCol_end; }

    constructor(
        private row_min: number,
        private row_max: number,
        private col_min: number,
        private col_max: number) {

        console.assert(this.row_min < this.row_max, "Invalid row_min and row_max values. row_min must be less than row_max");
        console.assert(this.col_min < this.col_max, "Invalid col_min and col_max values. col_min must be less than col_max");

        this.mRow_start = -1;
        this.mCol_start = -1;
        this.mCol_end = -1;
        this.mRow_end = -1;
    }

    set(rStart: number, cStart: number, rEnd: number = -1, cEnd: number = -1) {
        this.mRow_start = rStart;
        this.mRow_end = rEnd == -1 ? rStart : rEnd;
        this.mCol_start = cStart;
        this.mCol_end = cEnd == -1 ? cStart : cEnd;
        this.normalize();
    }

    get isSingleCell(): boolean {
        if (this.mRow_end == this.mRow_start && this.mCol_end == this.mCol_start) {
            return true;
        }
        return false;
    }

    get isActive(): boolean {
        if (this.mRow_start <= -1 || this.mCol_start <= -1) {
            return false;
        }
        return true;
    }

    clear(): void {
        this.mRow_start = this.row_start - 100;
        this.mCol_start = this.col_start - 100;
        this.mCol_end = this.col_start - 999;
        this.mRow_end = this.row_start - 999;
    }

    move(nbrRows: number, nbrCols: number): void {
        this.mRow_start += nbrRows;
        this.mRow_end += nbrRows;

        this.mCol_start += nbrCols;
        this.mCol_end += nbrCols;

        this.normalize();
    }

    grow(rowCount: number, colCount: number): void {
        this.mRow_end += rowCount;
        this.mCol_end += colCount;
        this.normalize();
    }

    click(rowId: number, colId: number): void {
        if (!this.isActive) {
            this.set(rowId, colId);
            return;
        }
        this.mCol_end = colId;
        this.mRow_end = rowId;
        this.normalize();
    }
    
    private normalize(): void {
        if (this.mRow_start < this.row_min) { this.mRow_start = this.row_min };
        if (this.mRow_start > this.row_max) { this.mRow_start = this.row_max };

        if (this.mRow_end > this.row_max) { this.mRow_end = this.row_max };
        if (this.mRow_end < this.row_min) { this.mRow_end = this.row_min };

        if (this.mCol_start < this.col_min) { this.mCol_start = this.col_min };
        if (this.mCol_start > this.col_max) { this.mCol_start = this.col_max };

        if (this.mCol_end > this.col_max) { this.mCol_end = this.col_max };
        if (this.mCol_end < this.col_min) { this.mCol_end = this.col_min };
    }

    //Helper functions take a function
    topRow(cb: SelectionCellCB): void {
        //let dir = this.mCol_start <= this.mCol_end ? 1 : -1;
        let cstart: number = this.mCol_start, cend: number = this.mCol_end;
        let row = this.mRow_start < this.mRow_end ? this.mRow_start : this.mRow_end;
        if (cstart > cend) { [cstart,cend] = [cend,cstart]}
        for (let colIndex = cstart; colIndex <= cend; ++colIndex ) {
            cb({ row: row, col: colIndex });
        }
    }

    bottomRow(cb: SelectionCellCB): void {
        let cstart: number = this.mCol_start, cend: number = this.mCol_end;
        if (cstart > cend) { [cstart, cend] = [cend, cstart] }
        let row = this.mRow_start > this.mRow_end ? this.mRow_start : this.mRow_end;
        for (let colIndex = cstart; colIndex <= cend; ++colIndex) {
            cb({ row: row, col: colIndex });
        }
    }

    leftCol(cb: SelectionCellCB): void {
        let rstart: number = this.mRow_start, rend: number = this.mRow_end;
        let col = this.mCol_start < this.mCol_end ? this.mCol_start : this.mCol_end;
        if (rstart > rend) { [rstart, rend] = [rend, rstart] }
        for (let rowIndex = rstart; rowIndex <= rend; ++rowIndex) {
            cb({row: rowIndex, col: col})
        }
    }

    rightCol(cb: SelectionCellCB): void {
        let rstart: number = this.mRow_start, rend: number = this.mRow_end;
        if (rstart > rend) { [rstart, rend] = [rend, rstart] }
        let col = this.mCol_start > this.mCol_end ? this.mCol_start : this.mCol_end;
        for (let rowIndex = rstart; rowIndex <= rend; ++rowIndex) {
            cb({ row: rowIndex, col: col })
        }
    }

    bodyOnly(cb: SelectionCellCB): void {
        let rstart: number = this.mRow_start, rend: number = this.mRow_end;
        if (rstart > rend) { [rstart, rend] = [rend, rstart] }
        let cstart: number = this.mCol_start, cend: number = this.mCol_end;
        if (cstart > cend) { [cstart, cend] = [cend, cstart] }

        for (let rowIndex = rstart+1; rowIndex <= rend-1; ++rowIndex ) {
            for (let colIndex = cstart + 1; colIndex <= cend - 1; ++colIndex ) {
                cb({ row: rowIndex, col: colIndex });
            }
        }
    }

    allCells(cb: SelectionCellCB): void {
        let rstart: number = this.mRow_start, rend: number = this.mRow_end;
        if (rstart > rend) { [rstart, rend] = [rend, rstart] }
        let cstart: number = this.mCol_start, cend: number = this.mCol_end;
        if (cstart > cend) { [cstart, cend] = [cend, cstart] }

        for (let rowIndex = rstart; rowIndex <= rend; ++rowIndex) {
            for (let colIndex = cstart; colIndex <= cend; ++colIndex) {
                cb({ row: rowIndex, col: colIndex });
            }
        }
    }
}

export interface ReadOnlySelectionCB {
    (cell:ScheduleWidgetCellInfo): void;
}

export class ReadOnlySelection {
    constructor(private mRow_start: number, private mRow_end: number,
        private mCol_start: number, private mCol_end: number, private parent : ScheduleWidget) {
        if (mRow_start > mRow_end) {
            [mRow_start, mRow_end] = [mRow_end, mRow_start];
        }
        if (mCol_start > mCol_end) {
            [mCol_start, mCol_end] = [mCol_end, mCol_start];
        }
    }

    get row_start(): number { return this.mRow_start; }
    get row_end(): number { return this.mRow_end; }
    get col_start(): number { return this.mCol_start; }
    get col_end(): number { return this.mCol_end; }

    get isSingleCell(): boolean {
        return (this.mRow_start == this.mRow_start && this.mCol_end == this.mCol_start);
    }

    forEach(cb: ReadOnlySelectionCB) {
        for (let row = this.mRow_start; row <= this.mRow_end; ++row) {
            for (let col = this.mCol_start; col <= this.mCol_end; ++col) {
                cb(this.parent.cell_details({ row: row, col: col }));
            }
        }
    }

    asArray(): Array<ScheduleWidgetCellInfo> {
        let ret = new Array<ScheduleWidgetCellInfo>();
        this.forEach((value) => ret.push(value));
        return ret;
    }

}
    
export class ScheduleWidget {


    private mParentElement: Node
    private mIDPrefix: string
    private mHtmlCells: HTMLCells;
    private mRoot: HTMLElement;
    private mOwnerToHtml: OwnerToCellMap;
    private mCurrentSelection: Selection;
    private mHtmlCol: HTMLElement[];
    private mHtmlRow: HTMLElement[];


    constructor(parent: Node) {
        this.mParentElement = parent;
        this.mIDPrefix = "Table";
        this.mOwnerToHtml = new Map<DataView, NumberToCell>();
    }

    private makeIDForCell(rowIndex: number, colIndex: number): string {
        if (colIndex < 0) {
            return this.mIDPrefix + "_" + rowIndex.toString();
        }

        return this.mIDPrefix + "_" + rowIndex.toString() + "_" + colIndex.toString();
    }

    private configureElement(element: HTMLElement, rowIndex: number, colIndex: number) {
        element.id = this.makeIDForCell(rowIndex, colIndex);
        element.setAttribute(SWAttributes.RowIndex, rowIndex.toString());
        element.setAttribute(SWAttributes.ColIndex, colIndex.toString());
    }

    get root(): HTMLElement {
        return this.mRoot;
    }

    private selection_render_clear(sel: Selection) {
        let cb = (id: ScheduleWidgetID): void => {
            this.mHtmlCells[id.row][id.col].element.classList.remove(
                CssSelection.BottomBorder,
                CssSelection.LeftBorder,
                CssSelection.RightBorder,
                CssSelection.Selected,
                CssSelection.TopBorder);
        }
        if (sel.isActive) {
            sel.allCells(cb);
        }
    }

    private isIDValid(id: ScheduleWidgetID): boolean {
        return !isNaN(id.row) || !isNaN(id.col);
    }

    private selection_render_all(sel: Selection) {
        let that = this;
        sel.topRow((id) => that.mHtmlCells[id.row][id.col].element.classList.add(CssSelection.TopBorder, CssSelection.Selected));
        sel.bottomRow((id) => that.mHtmlCells[id.row][id.col].element.classList.add(CssSelection.BottomBorder, CssSelection.Selected));
        sel.rightCol((id) => that.mHtmlCells[id.row][id.col].element.classList.add(CssSelection.RightBorder, CssSelection.Selected));
        sel.leftCol((id) => that.mHtmlCells[id.row][id.col].element.classList.add(CssSelection.LeftBorder, CssSelection.Selected));
        sel.bodyOnly((id) => that.mHtmlCells[id.row][id.col].element.classList.add(CssSelection.Selected));
    }

    selection_get(): ReadOnlySelection {
        return new ReadOnlySelection(this.mCurrentSelection.row_start, this.mCurrentSelection.row_end,
            this.mCurrentSelection.col_start, this.mCurrentSelection.col_end, this);
    }

    selection_setByRowCol(row: number, col: number): void {

    }

    selection_setByData(id: number, owner: DataView) {

    }

    selection_advance(rows: number, cols: number): ScheduleCellID {
        this.selection_render_clear(this.mCurrentSelection);
        this.mCurrentSelection.set(this.mCurrentSelection.row_start + rows,
            this.mCurrentSelection.col_start + cols);
        this.selection_render_all(this.mCurrentSelection);
        return new ScheduleCellID(this.mCurrentSelection.row_start, this.mCurrentSelection.col_start);
    }

    selection_move(rows: number, cols: number): void {

    }

    selection_grow(rows: number, cols: number): void {
        this.selection_render_clear(this.mCurrentSelection);
        this.mCurrentSelection.grow(rows, cols);
        this.selection_render_all(this.mCurrentSelection);
    }

    selection_clear(): void {
        this.selection_render_clear(this.mCurrentSelection);
        this.mCurrentSelection.clear();
    }

    selection_click(id: ScheduleWidgetID, newClick: boolean) {
        if (!this.isIDValid(id)) { return; }
        this.selection_render_clear(this.mCurrentSelection);
        if (newClick) {
            this.mCurrentSelection.set(id.row, id.col);
            this.mHtmlCells[id.row][id.col].element.focus();
        }
        else {
            this.mCurrentSelection.click(id.row, id.col);
        }
        this.selection_render_all(this.mCurrentSelection);
    }

    get selection_firstcell(): ScheduleWidgetID {
        return {
            row: this.mCurrentSelection.row_start,
            col: this.mCurrentSelection.col_start
        };
    }

    cell_value(id: ScheduleWidgetID): string {
        if (this.isIDValid(id)) {
            return this.mHtmlCells[id.row][id.col].element.textContent;
        }
        else {
            return "";
        }
    }

    cell_details(id: ScheduleWidgetID): ScheduleWidgetCellInfo {
        if (this.isIDValid(id)) {
            return {
                id: new ScheduleCellID(id.row, id.col),
                data: new Datum(this.mHtmlCells[id.row][id.col].element.textContent,
                    this.mHtmlCells[id.row][id.col].id,
                    this.mHtmlCells[id.row][id.col].owner)
            };
        } else {
            return {
                id: new ScheduleCellID(id.row, id.col),
                data: new ReadonlyDataItem("")
            };
        }
    }

    getElementID(element: HTMLElement): ScheduleCellID {
        /* let row = -1, col = -1;
         switch (element.tagName) {
             case "TH":
             case "TD":
                 let td = <HTMLTableCellElement>element;
                 col = td.cellIndex;
                 row = (<HTMLTableRowElement>td.parentElement).rowIndex;
                 break;
             case "TR":
                 break;
         }
 
         console.log(row == parseInt(element.getAttribute(SWAttributes.RowIndex)));
         console.log(col == parseInt(element.getAttribute(SWAttributes.ColIndex)));
         */
        return new ScheduleCellID(parseInt(element.getAttribute(SWAttributes.RowIndex)),
            parseInt(element.getAttribute(SWAttributes.ColIndex)));
    }


    getElementDetails(element: HTMLElement): ScheduleWidgetCellInfo {
        let id = this.getElementID(element);
        return this.cell_details(id);
    }

    getHtmlElement(id: ScheduleWidgetID): HTMLElement {
        if (this.isIDValid(id)) {
            return this.mHtmlCells[id.row][id.col].element;
        }
        else {
            return null;
        }
    }

    private onChange = (e: EventOnChange): boolean => {
        if (!this.mOwnerToHtml.has(e.owner)) { return true; }

        const oMap = this.mOwnerToHtml.get(e.owner);
        let that = this;
        e.ids.forEach((value, index) => {
            if (oMap.has(value)) {
                oMap.get(value).element.textContent = e.values[index].toString();
            }
        });
        return true;
    }

    private register_owner(owner: DataView): Map<number, HtmlCell> {
        if (this.mOwnerToHtml.has(owner) == false) {
            let newMap = new Map<number, HtmlCell>();
            this.mOwnerToHtml.set(owner, newMap);
            if (owner.events) {
                owner.events.addListener(this.onChange);
            }
            return newMap;
        }
        return this.mOwnerToHtml.get(owner);
    }

    private clear_internals(): void {
        this.mOwnerToHtml = null;
        this.mOwnerToHtml = new Map<DataView, NumberToCell>();
        this.mHtmlCells = null;
    }



    /*render(layout : LayoutTable): void {
        // Emtpy the existing data structures
        this.clear_internals();

        let fragment = document.createDocumentFragment();
        let table = document.createElement("table");
        fragment.appendChild(table);
        let grid = layout.toGrid();

        this.mHtmlCells = new Array<Array<HtmlCell>>(grid.length);
        for (let rowIndex = 0; rowIndex < grid.length; ++rowIndex) {
            let tr = document.createElement("tr");
            let row = grid[rowIndex];
        
            this.mHtmlCells[rowIndex] = new Array<HtmlCell>(row.length);
            for (let colIndex = 0; colIndex < row.length; ++colIndex) {
                let cell = row[colIndex];
                if (!cell.isEmpty()) {
                    let tdType : string = cell.isHeader ? "th" : "td";
                    let td = document.createElement(tdType);
  
                    // Update the internal mapping
                    let htmlCell = new HtmlCell(td, cell.data);
                    this.register_owner(cell.data.owner).set(cell.data.id, htmlCell); //Could be made more efficent with cacheing
                    this.mHtmlCells[rowIndex][colIndex] = htmlCell;
                    // End internal mappings
                    
                    if (cell.rowspan > 1)
                        td.setAttribute(SWAttributes.Rowspan, cell.rowspan.toString());
                    if (cell.colspan > 1)
                        td.setAttribute(SWAttributes.Colspan, cell.colspan.toString());
                    if (cell.cssClasses.length > 0) {
                        cell.cssClasses.forEach((value: string) => { td.classList.add(value) });
                    }
                    
                    td.textContent = cell.data.value.toString();
                    this.configureElement(td, rowIndex, colIndex);
                    tr.appendChild(td);
                }
            }

            table.appendChild(tr);
        }
        this.mParentElement.appendChild(fragment);
        this.mRoot = <HTMLElement> this.mParentElement.lastChild;
        grid = null;

        // Currently a quick hack should make it ignore the header cells
        this.mCurrentSelection = new Selection(2, this.mHtmlCells.length - 1, 2, this.mHtmlCells[0].length-1);
    }*/

    render(layout: LayoutTable): void {
        // Emtpy the existing data structures


        function create_columns_descriptors(parent: HTMLElement, nbrColumns: number): HTMLElement[] {
            let colGroup = document.createElement("colgroup");
            let retArray = new Array<HTMLElement>(nbrColumns);

            for (let i = 0; i < nbrColumns; ++i) {
                let colItem: HTMLElement = document.createElement("col");
                colGroup.appendChild(colItem);
                retArray[i] = colItem;
            }
            parent.appendChild(colGroup);
            return retArray;
        }

        function build_storage(row_length: number, col_length: number): Array<Array<HtmlCell>> {
            let HtmlCells = new Array<Array<HtmlCell>>(row_length);
            for (let rowIndex = 0; rowIndex < col_length; ++rowIndex) {
                HtmlCells[rowIndex] = new Array<HtmlCell>(col_length);
            }
            return HtmlCells;
        }


        this.clear_internals();

        let fragment = document.createDocumentFragment();
        let table = document.createElement("table");
        fragment.appendChild(table);
        let grid = layout.toGrid();
        let range_left = new TableRange(0, grid.length - 1,0, grid[0].length - 1);


        //let col_meta = layout.metaData_get(MetaTypes.Columns);

        this.mHtmlCells = build_storage(grid.length, grid[0].length);
        this.mHtmlCol = create_columns_descriptors(table, range_left.col_end);
        this.mHtmlRow = new Array<HTMLElement>();

        //Generate the header meta element
        if (layout.metaData_exists(MetaTypes.Header)) {
            const tHead = document.createElement("thead");
            // Only grab the first header item. Others are ignored
            const tMeta = layout.metaData_get(MetaTypes.Header)[0];

            // Make a new range as the header type meta element applies to rows (the first rows)
            this.render_cells(tHead, new TableRange(tMeta.range.row_start, tMeta.range.row_end, range_left.col_start, range_left.col_end), grid);
            range_left.row_start = tMeta.range.row_end + 1;
            table.appendChild(tHead);
        }

        //Ignore the footer for now

        //Render the body
        {
            const body = document.createElement("tbody");
            this.render_cells(body, range_left, grid);
            table.appendChild(body);
        }

        // Set the allowed selection amount based off RowHeader meta data
        if (layout.metaData_exists(MetaTypes.RowHeader)) {
            const rowheader = layout.metaData_get(MetaTypes.RowHeader)[0];
            this.mCurrentSelection = new Selection(range_left.row_start, range_left.row_end,
                                                   rowheader.range.col_end + 1, range_left.col_end);
        } else {
            // Defaults to the first row as the header.
            this.mCurrentSelection = new Selection(range_left.row_start, range_left.row_end,
                                                   1, range_left.col_end);
        }
        
        this.render_painters(layout)

        this.mParentElement.appendChild(fragment);
        this.mRoot = <HTMLElement>this.mParentElement.lastChild;
        grid = null;
    }

    private render_cells(parent: HTMLElement, range: TableRange, grid: Cell2d): void {
        for (let rowIndex = range.row_start; rowIndex <= range.row_end; ++rowIndex) {
            let tr = document.createElement("tr");
            this.mHtmlRow.push(tr);
            const row = grid[rowIndex];

            for (let colIndex = range.col_start; colIndex <= range.col_end; ++colIndex) {
                const cell = row[colIndex];
                if (!cell.isEmpty()) {
                    let tdType: string = cell.isReadOnly ? "th" : "td";
                    let td = document.createElement(tdType);

                    // Update the internal mapping
                    let htmlCell = new HtmlCell(td, cell.data);
                    this.register_owner(cell.data.owner).set(cell.data.id, htmlCell); //Could be made more efficent with cacheing
                    this.mHtmlCells[rowIndex][colIndex] = htmlCell;
                    // End internal mappings

                    if (cell.rowspan > 1)
                        td.setAttribute(SWAttributes.Rowspan, cell.rowspan.toString());
                    if (cell.colspan > 1)
                        td.setAttribute(SWAttributes.Colspan, cell.colspan.toString());
                    if (cell.cssClasses.length > 0) {
                        cell.cssClasses.forEach((value: string) => { td.classList.add(value) });
                    }

                    td.textContent = cell.data.value.toString();
                    this.configureElement(td, rowIndex, colIndex);
                    tr.appendChild(td);
                }
            }

            parent.appendChild(tr);
        }
    }

    private render_painters(layout: LayoutTable): void {
        // Column Painters -- start
        if (layout.metaData_exists(MetaTypes.Columns)) {
            const cRanges = layout.metaData_get(MetaTypes.Columns);
            for (var item of cRanges) {
                item.range.forEach((row, col) => {
                    const tHtmlCell = this.mHtmlCells[row][col];
                    const PInfo = {
                        value: tHtmlCell.element.textContent,
                        row: row,
                        col: col,
                        owner: tHtmlCell.owner,
                        id: tHtmlCell.id
                    };
                    if (item instanceof ColumnPainter) {
                        item.paint(this.mHtmlCol[col], PInfo);
                    }
                })
            }
        }
        // Column Painters -- end

        if (layout.metaData_exists(MetaTypes.Rows)) {
            const cRanges = layout.metaData_get(MetaTypes.Columns);
            for (var item of cRanges) {
                item.range.forEach((row, col) => {
                    const tHtmlCell = this.mHtmlCells[row][col];
                    const PInfo = {
                        value: tHtmlCell.element.textContent,
                        row: row,
                        col: col,
                        owner: tHtmlCell.owner,
                        id: tHtmlCell.id
                    };
                    if (item instanceof RowPainter) {
                        item.paint(this.mHtmlRow[row], PInfo);
                    }
                })
            }
        }
    }

    private render_painters_forEach = (row: number, col: number, painter: Painter) => {
        
    }
}
