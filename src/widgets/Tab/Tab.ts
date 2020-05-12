import { Widget } from "../widget";

export class TabWidget implements Widget {
    root: HTMLElement;    render(): HTMLElement {
        const root: HTMLElement = document.createElement("div");
        root.classList.add("tab-widget");

        const button_tabs = document.createElement("div");
        button_tabs.classList.add("tab-section");

        const container = document.createElement("div");
        container.classList.add("tab-container");

        root.appendChild(button_tabs);

        for (const x of ["Hello", "Goodbye"]) {
            const tab = document.createElement("button");
            tab.classList.add("tab-button");
            tab.textContent = x;
            button_tabs.appendChild(tab);
        }

        for (const x of ["This is one piece of content", "This is more content"]) {
            const content = document.createElement("div");
            content.textContent = x;
            container.appendChild(content);
        }


        root.appendChild(container);

        return root;
    }
    children(): HTMLElement[] {
        throw new Error("Method not implemented.");
    }


}