import { IObservableList } from "../../data/IObservableList";

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

export class BasicList<T> {
    //private element: HTMLElement
    //private list: IObservableList<T>
    //private node_render: IBasicListNodeRender<T>
    private root_element: HTMLElement;
    private nodes: HTMLElement[] = new Array<HTMLElement>();
        
    

    constructor(private list: IObservableList<T>, private node_render: IBasicListNodeRender<T>) {
        //list.events.onChange.addListener()
    }

    get root() {
        return this.root_element;
    }


    render(): DocumentFragment {
        let doc = new DocumentFragment();
        this.root_element = document.createElement("ul");
        doc.appendChild(this.root_element);
        for (let item of this.list) {
            let node = this.node_render.render(item);
            this.root_element.appendChild(node);
            this.nodes.push(node);
        }
        return doc;
    }
}