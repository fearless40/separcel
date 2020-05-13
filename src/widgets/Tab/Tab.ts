import { Widget, Content, renderContent } from "../widget";

const TABINDEX = "data-tabid"
const TABORDER = "data-taborder"

export const enum TabSide {
    Left = "left",
    Right = "right",
    Top = "top",
    Bottom = "bottom"
}

class TabItem {
    constructor(public text: string, public content: Content) {

    }
}

export class TabWidget implements Widget {
    constructor() {
        this.tabOrientation = TabSide.Top;
        this.tabs = new Array<TabItem>();
        this.activeTab = 0;
    }


    private _root: HTMLElement;
    private tabs: TabItem[];
    private activeTab: number;

    get root() {
        return this._root;
    }

    tabOrientation: TabSide;

    

    render() : HTMLElement {
        if (this._root) {
            this._root.innerHTML = "";
        }
        else {
            this._root = document.createElement("div");
            this._root.classList.add("tab-widget-" + this.tabOrientation);
        }

        const container = document.createElement("div");
        container.classList.add("tab-container");

        const tab_section = document.createElement("div");
        tab_section.classList.add("tab-section");
        tab_section.addEventListener("click", (ev: MouseEvent) => {
            const ele = ev.target as HTMLElement;
            if (ele.hasAttribute(TABINDEX)) {
                const id = parseInt(ele.getAttribute(TABINDEX));
                const element = container.querySelector(`[${TABINDEX}="${id}"]`);

                const oldElement = container.querySelector(`[${TABINDEX}="${this.activeTab}"]`);
                (oldElement as HTMLElement).style.display = "none";
                (element as HTMLElement).style.display = "block";

                this.activeTab = id;
            }
        });

       

        this.tabs.forEach((value, index) => {
            const tabElement = document.createElement("button");
            tabElement.classList.add("tab-button");
            tabElement.textContent = value.text;
            tabElement.setAttribute(TABINDEX, index.toString());
           

            const hidden_content = document.createElement("div");
            hidden_content.setAttribute(TABINDEX, index.toString());
            hidden_content.appendChild(renderContent(value.content));

            if (this.activeTab == index) {
                hidden_content.style.display = "block";
            }
            else {
                hidden_content.style.display = "none";
            }
            container.appendChild(hidden_content);

            tab_section.appendChild(tabElement);
        });

        this._root.appendChild(tab_section);
        this._root.appendChild(container);

        return this._root;

    }

 
    children(): HTMLElement[] {
        throw new Error("Method not implemented.");
    }
    
    addTab(tabText: string, content : Content): number {
        this.tabs.push(new TabItem(tabText, content));
        return this.tabs.length - 1;
    }

    removeTab(tabId: string | number) : void {

    }

    setActiveTab(tabID: string | number): void {
        if (typeof tabID == "number") {
            if (tabID < 0 || tabID >= this.tabs.length)
                tabID = 0;
            this.activeTab = tabID;
        }
        else {
            this.setActiveTab(this.tabs.findIndex((value) => value.text === tabID));
        }
    }
    


}