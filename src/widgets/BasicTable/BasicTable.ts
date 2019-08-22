import { IObservableVector, IObservableEvent, ChangeEventType, ChangeReindexValues, IObervableChangeReindex } from "../../data/IObservableList";
import { SWAttributes } from "../Schedule/ScheduleWidget";

const enum ColumnType {
    Field,
    Selection
}

const enum Attributes {
    dataid = "data-id"
}

class Column {
    type : ColumnType
    field: string
    display: string
}


export class ColumnBuilder {

    private column : Column[]

    selection_column(display?: string) {
        const value: Column = {
            type: ColumnType.Selection,
            field: "",
            display: display || "Selection"
        };

        if ( (this.column.length != 0) && (this.column[0].type == ColumnType.Selection)) {
            return;
        }
        else {
            this.column.unshift(value)
        }
    }

    field(fieldname: string, display?: string, sorted?: boolean) {
        const value: Column = {
            type: ColumnType.Field,
            field: "",
            display: display || fieldname
        }
    }

    constructor() {
        this.column = [];
    }

    get value() {
        return this.column;
    }


}

export class BasicTable {
    private root: HTMLElement;
    private header_root: HTMLElement;
    private body_root: HTMLElement;
    private body_table: HTMLElement;

    private columns: Array<Column>
    private data : IObservableVector<any>

    selection_get(): number[] {
        return [];
    }

    selection_set(ids: number[]): void {

    }

    
    constructor(DataList: IObservableVector<any>, columns: ColumnBuilder) {
        
        this.columns = columns.value;

        this.data = DataList;

        this.data.events.addListener(this.ondatachange);
    }

    private onAdd(ids: number[], values: any[]) {
        ids.forEach((value, index) => {
            this.render_row(value, values[index]);
        })
    }

    private find_single_element(id: number) {
        const ids = id.toString();
        for (let element of this.body_table.children) {
            if (element.getAttribute(Attributes.dataid) == ids) {
                return element as HTMLElement;
            }
        }
    }

    private build_element_map() {
        const mapper = new Map<number, HTMLElement>();
        for (let element of this.body_table.children) {
            mapper.set(parseInt(element.getAttribute(Attributes.dataid)), element as HTMLElement);
        }
        return mapper;
    }

    private onModify(ids: number[], values: any[]) {
        if (ids.length == 1) {
            let element = this.find_single_element(ids[0]);
            if (element)
                this.render_update_row(element as HTMLElement, ids[0], values[0]);

        } else {
            //Build a map of items and indexs 
            const mapper = this.build_element_map();

            ids.forEach((value, index) => {
                if (mapper.has(value)) {
                    this.render_update_row(mapper.get(value), value, values[index]);
                }
            });
        }
    }

    private onRemove(ids: number[], values: any[]) {
        if (ids.length == 1) {
            let element = this.find_single_element(ids[0]);
            if (element)
                this.body_table.removeChild(element);

        } else {
            //Build a map of items and indexs 
            const mapper = this.build_element_map();

            ids.forEach((value, index) => {
                if (mapper.has(value)) {
                    this.body_table.removeChild(mapper.get(value));
                }
            });
        }

    }

    private onReindex(ids: ChangeReindexValues[]) {
        if (ids.length == 1) {
            let element = this.find_single_element(ids[0].oldid);
            if (element)
                this.render_update_row(element as HTMLElement, ids[0].newid);

        } else {
            //Build a map of items and indexs 
            const mapper = this.build_element_map();

            ids.forEach((value, index) => {
                if (mapper.has(value.oldid)) {
                    this.render_update_row(mapper.get(value.oldid), value.newid);
                }
            });
        }

    }

    ondatachange = (event: IObservableEvent<any>): boolean => {
        switch (event.event) {
            case ChangeEventType.Add:
                this.onAdd(event.ids, event.values);
                return;
            case ChangeEventType.Modify:
                this.onModify(event.ids, event.values);
                return;
            case ChangeEventType.Remove:
                this.onRemove(event.ids, event.values);
                return;
            case ChangeEventType.Reindex:
                this.onReindex((event as IObervableChangeReindex<any>).ids);
                return;
        }
        return true;
    }


    render(): DocumentFragment {
        let doc = document.createDocumentFragment();
        this.root = document.createElement("div");
        this.header_root = document.createElement("table");
        this.body_root = document.createElement("div");
        this.body_table = document.createElement("table");

        doc.appendChild(this.root);
        this.root.appendChild(this.header_root);
        this.root.appendChild(this.body_root);
        this.body_root.appendChild(this.body_table);

        this.render_header();
        this.render_body();

        return doc;
    }

    private render_header(): void {
        const row = document.createElement("tr");
   

        this.columns.forEach((value: Column) => {
            const col = document.createElement("th");
            col.innerText = value.display;
            row.appendChild(col);
        });

        this.header_root.appendChild(row);
    }
    
    
    private render_body(): void {

        for (let item of this.data) {
            this.render_row(item.id, item.value);
        }
        
    }

    private render_update_row(element: HTMLElement, index: number, value?: any) {
        element.setAttribute(Attibutes.dataid, index.toString());

        if (!value) return;

        this.columns.forEach((col, index) => {
            if (col.type == ColumnType.Selection) { }
            else {
                element.children[index].firstChild.textContent = value[col.field];
            }
        });
    }

    private render_row(index : number, value: any): void {
        const row = document.createElement("tr");
        row.setAttribute(Attibutes.dataid, index.toString());
        this.body_table.appendChild(row);

        this.columns.forEach((col_type: Column) => {
            const col = document.createElement("td");
            if (col_type.type == ColumnType.Selection) {
                const selection = document.createElement("input");
                selection.setAttribute("type", "checkbox");
                col.appendChild(selection);
            } else {
                if (col_type.field == "") {

                } else {
                    col.innerText = value[col_type.field];
                }
            }
            row.appendChild(col);
        });


    }
    
}