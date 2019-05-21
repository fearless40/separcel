import {ScheduleWidget, ScheduleWidgetID, ScheduleCellID, ScheduleWidgetCellInfo, ReadOnlySelection, ReadOnlySelectionCB} from "../widgets/Schedule/ScheduleWidget";
import { LayoutTable } from "../layout/Table"
import { FloatingTextInput } from "../widgets/FloatingTextInput";
import { Cell } from "../layout/Cell";
import { DataView, DataValue } from "../data/Data";

export class TableEditor {
    private mSchedule : ScheduleWidget;
    private mLayout: LayoutTable;
    private mFloat: FloatingTextInput;
    private mSelecting: boolean = false;
    private cellEdit: boolean = false;

    constructor(parentNode : HTMLElement, layout : LayoutTable) {
        this.mLayout = layout;
        this.mSchedule = new ScheduleWidget(parentNode);
        this.mFloat = new FloatingTextInput();
    }

    private attach() {
        this.mSchedule.root.addEventListener('mousedown', this.onMouseDown);
        this.mSchedule.root.addEventListener('mousemove', this.onMouseMove);
        this.mSchedule.root.addEventListener('mouseup', this.onMouseUp);
        this.mFloat.root.addEventListener('keydown', this.onKeyDown);
        this.mFloat.root.addEventListener('keyup', this.onKeyUp);
    }

    private setCellEdit(on: boolean): void {
        this.cellEdit = on;
        if (!on) {
            this.mFloat.root.classList.add("widget-hide-caret");
        }
        else {
            this.mFloat.root.classList.remove("widget-hide-caret");
        }
    }

    private cellEditor_store(): void {
        if (this.mFloat.isDirty) {
            // Need to retieve the id of the cell that it is editing
            const cid = this.mSchedule.selection_firstcell;
            const cell = this.mSchedule.cell_details(cid);
            this.process_change(cell, this.mFloat.value);
            this.mFloat.dirty_reset();
        }
    }

    private cellEditor_move(element : HTMLElement | ScheduleWidgetID, value : string): void {
        this.setCellEdit(false);

        // Now set the editor to the new cell
        if (element instanceof HTMLElement ) {
            this.mFloat.show(element, value);
        }
        else {
            this.mFloat.show(this.mSchedule.getHtmlElement(element), value);
        }
    }

    private process_change(cell : ScheduleWidgetCellInfo, newValue : string): void {
        if (cell.data.value.toString() != newValue) {
                cell.data.owner.modify([cell.data.id], [newValue]);
        }
    }

    private process_changes(cells: ScheduleWidgetCellInfo[], newValues: string[]): void {
        let owner: DataView = cells[0].data.owner;
        let batchId = new Array<number>();
        let batchval = new Array<DataValue>();

        for (let i = 0; i < cells.length; ++i) {
            if (owner != cells[i].data.owner) {
                owner.modify(batchId, batchval);

                owner = cells[i].data.owner;
                batchId = new Array<number>();
                batchval = new Array<DataValue>();
            }
            else {
                batchId.push(cells[i].data.id);
                batchval.push(newValues[i]);
            }
        }
        owner.modify(batchId, batchval);
    }

    private selection_advance(row: number, col: number) {
        this.cellEditor_store();
        const newId = this.mSchedule.selection_advance(row, col);
        if (newId.isValid) {
            this.cellEditor_move(newId, this.mSchedule.cell_value(newId));
        }
    }

    private selection_delete() {
        const ids = this.mSchedule.selection_get().asArray();
        const values = new Array<string>(ids.length);
        values.fill("");
        this.process_changes(ids, values);
        this.cellEditor_move(this.mSchedule.selection_firstcell, "");
    }

    private onKeyDownSelection(e: KeyboardEvent): void {
        let advanceBy = 1;
        if (e.ctrlKey) {
            advanceBy = 5;
        }

        switch (e.code) {
            case 'ArrowDown':
                this.mSchedule.selection_grow(advanceBy, 0);
                e.preventDefault();
                break;

            case 'ArrowLeft':
                this.mSchedule.selection_grow(0, -advanceBy);
                e.preventDefault();
                break;

            case 'ArrowRight':
                this.mSchedule.selection_grow(0, advanceBy);
                e.preventDefault();
                break;

            case 'ArrowUp':
                this.mSchedule.selection_grow(-advanceBy, 0);
                e.preventDefault();
                break;
        }
    }

    private onKeyDownCellEdit(e: KeyboardEvent): void {
        if (e.code == "Escape") {
            this.setCellEdit(false);
            e.preventDefault();
        }
    }

    private onKeyDownNotCellEdit(e: KeyboardEvent): void {
        //let cellID: ScheduleCellID = null;
        switch (e.code) {
            case "ArrowLeft":
                this.selection_advance(0, -1);
                e.preventDefault();
                break;
            case "Tab":
            case "ArrowRight":
                this.selection_advance(0, 1);
                e.preventDefault();
                break;
            case "ArrowUp":
                this.selection_advance(-1, 0);
                e.preventDefault();
                break;
            case "Enter":
            case "ArrowDown":
                this.selection_advance(1, 0);
                e.preventDefault();
                break;
            case "Delete":
                this.selection_delete();
                e.preventDefault();

                
        }
    } 

    private onKeyDown = (e: KeyboardEvent): void => {
       // if (e.defaultPrevented) return;
        
        if (e.shiftKey && this.cellEdit == false) {
            this.onKeyDownSelection(e);
        }
        else if (this.cellEdit) {
            this.onKeyDownCellEdit(e);
        }
        else {
            this.onKeyDownNotCellEdit(e);
        }
        
    }

    private onKeyUp = (e: Event): void => {
        
    }

    private onMouseDown = (e: MouseEvent): void => {
        if (e.target == this.mFloat.root) {
            this.setCellEdit(true);
        }
        else {
            let cell = this.mSchedule.getElementDetails(<HTMLElement>e.target);
            if (e.button == 0 && cell.id.isValid) {
                this.cellEditor_store();
                this.cellEditor_move(<HTMLElement>e.target, cell.data.value.toString());
                this.mSchedule.selection_click(cell.id, true);
                this.mSelecting = true;
            } else {
                this.mSelecting = false;
            }
        }
        e.preventDefault();
    }
    private onMouseMove = (e: MouseEvent): void => {
        if (e.target == this.mFloat.root) {

        }
        else {
            if (e.buttons == 1) {
                if (this.mSelecting) {
                    this.mSchedule.selection_click(this.mSchedule.getElementID(<HTMLElement>e.target), false)
                }
            } else {
                this.mSelecting = false;
            }
        }
        e.preventDefault();
    }

    private onMouseUp = (e: MouseEvent): void => {
       if (e.target == this.mFloat.root) {
            //this.setCellEdit(true);
        }
        else {
            this.mSchedule.selection_click(this.mSchedule.getElementID(<HTMLElement>e.target), false)
            this.mSelecting = false;
            this.setCellEdit(false);
        }
        e.preventDefault();
    }

    show() : void {
        this.mSchedule.render(this.mLayout);
        this.attach();
    }
}