import { LayoutTable } from "../view/TableLayout";
export declare class TableRender {
    private mParentElement;
    private mLayout;
    constructor(parent: Node, layout: LayoutTable);
    render(): void;
}
