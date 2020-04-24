import { Widget } from "../widget";
import { Container } from "../container";

export interface Grid2x2x1Data {
    root: HTMLElement
    left: Widget | HTMLElement
    rightTop: Widget | HTMLElement
    rightBottom: Widget | HTMLElement
}

export class Grid2x2x1Render  {
    place(data: Grid2x2x1Data, insertDiv : boolean = false) : DocumentFragment {
        data.root.classList.add("layout-grid-container-2x1x1");

        {
            const element: HTMLElement = Container.resolve(data.left, insertDiv);
            element.classList.add("layout-grid-left");
            data.root.appendChild(element);
        }

        {
            const element = Container.resolve(data.rightTop, insertDiv);
            element.classList.add("layout-grid-rightTop");
            data.root.appendChild(element);
        }

        {
            const element = Container.resolve(data.rightBottom, insertDiv);
            element.classList.add("layout-grid-rightBottom");
            data.root.appendChild(element);
        }



        const doc = document.createDocumentFragment();
        doc.appendChild(data.root);

        return doc;
    }
}