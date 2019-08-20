import { IObservableList } from "../../data/IObservableList";

const enum ColumnType {
    Field,
    Selection
}

const enum Attibutes {
    dataid = "data-id"
}

class Column {
    type : ColumnType
    field: string
}


export class BasicTable {
    private root: HTMLElement;
    private header_root: HTMLElement;
    private body_root: HTMLElement;
    private body_table: HTMLElement;

    private columns: Array<Column>
    private data : IObservableList<any>

    constructor(DataList: IObservableList<any>, selection_column : boolean, columns: Array<string>) {
        
        let start_position = 0;
       
        if (selection_column) {
            this.columns = new Array<Column>(columns.length + 1);
            this.columns[0] = { type: ColumnType.Selection, field: "Select" };
            start_position = 1;
        } else {
            this.columns = new Array<Column>(columns.length);
        }

        // Copy the columns into a format that works for the class
        for (let index = 0; index < columns.length; ++index) {
            this.columns[start_position + index] = {
                type: ColumnType.Field,
                field: columns[index]
            };
        }

        this.data = DataList;
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
            col.innerText = value.field;
            row.appendChild(col);
        });

        this.header_root.appendChild(row);
    }
    
    
    private render_body(): void {

        for (let index = this.data.begin(), last = this.data.end(); index < last; ++index) {
            this.render_row(index, this.data.get(index));
        }
        
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