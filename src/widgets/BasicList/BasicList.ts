import { Widget } from "../widget";


export interface IBasicListNodeRender<T> {
    render(item: T): HTMLElement
    update(item:T, element:  HTMLElement) : void
}

export class BasicListNodeRenderString implements IBasicListNodeRender<string> {
    render(item: string): HTMLElement {
        const li = document.createElement("li");
        li.classList.add("widget-list-item");
        li.textContent = item;
        return li;
    }

    update(item: string, element: HTMLElement): void {
        element.textContent = item;
    }
}

export class BasicList<T> implements Widget {
    //private element: HTMLElement
    //private list: IObservableList<T>
    //private node_render: IBasicListNodeRender<T>
    private root_element: HTMLElement;
    private nodes: HTMLElement[];
        
    

    constructor(data: Array<T>, private node_render: IBasicListNodeRender<T>) {
        this.create(data);
    }

    get root() {
        return this.root_element;
    }
    
    private create(data: Array<T>) {
        this.root_element = document.createElement("ul");
        this.nodes = data.map((value: T) => {
            return this.node_render.render(value);
        });
    }

    children() : HTMLElement[] {
        return this.nodes;
    }

    update(data: Array<T>) {
        for (let i = 0; i < data.length; ++i) {
            this.node_render.update(data[i], this.nodes[i]);
        }

        // Clear empty nodes
        for (let i = data.length; i < this.nodes.length; ++i) {
            this.nodes[i].remove();
        }
    }


    render(): DocumentFragment {
        let doc = new DocumentFragment();
        doc.appendChild(this.root_element);
        for (let item of this.nodes) {
            this.root_element.appendChild(item);
        }
        return doc;
    }
}