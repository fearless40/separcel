import { Widget } from "../widgets/widget";

export class Behaviors {


    static onSelection(widget: Widget, callback: (index: string, element: HTMLElement, widget: Widget) => void) {
        widget.root.addEventListener("click", (event: MouseEvent) => {
            const target = <HTMLElement>event.target;
            if (target.hasAttribute("data-index")) {
                callback(target.getAttribute("data-index"), target, widget);
            }
            else {
                callback("", target, widget);
            }
        });
    }

    static singleItemSelectionCSS(toggleclasslist : string, callback: (index : string) => void) {
        return function (index: string, element: HTMLElement, widget: Widget) {
            if (element !== widget.root) {
                widget.root.querySelectorAll("." + toggleclasslist).forEach((value) => value.classList.remove(toggleclasslist));
                element.classList.add(toggleclasslist);
                callback(index);
            }
        }
    }
}