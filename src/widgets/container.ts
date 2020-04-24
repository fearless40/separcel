import { Widget, isWidget } from "./widget";


export class Container {

    private static _resolve(item: Widget | HTMLElement): HTMLElement {
        if (isWidget(item)) {
            return item.render();
        }
        else {
            return item;
        }

    }

    static resolve(item: Widget | HTMLElement, insertDivs : boolean): HTMLElement {
        if (insertDivs) {
            const div = document.createElement("div");
            div.appendChild(this._resolve(item));
            return div;
        }
        else {
            return this._resolve(item);
        }
    }
        
}