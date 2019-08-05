/*class Greeter {
    element: HTMLElement;
    span: HTMLElement;
    timerToken: number;

    constructor(element: HTMLElement) {
        this.element = element;
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement('span');
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toUTCString();
    }

    start() {
        this.timerToken = setInterval(() => this.span.innerHTML = new Date().toUTCString(), 500);
    }

    stop() {
        clearTimeout(this.timerToken);
    }

}

window.onload = () => {
    var el = document.getElementById('content');
    var greeter = new Greeter(el);
    greeter.start();
};
*/


export const enum AppPositions {
    header,
    lbar,
    main,
    rbar,
    footer
};

export class App {
    private root: HTMLElement;
    private header: HTMLElement;
    private lbar: HTMLElement;
    private main: HTMLElement;
    private rbar: HTMLElement;
    private footer: HTMLElement;

    constructor() {
        this.root = document.getElementById("appRoot");
        this.header = document.getElementById("appHeader");
        this.lbar = document.getElementById("appLeftSidebar");
        this.main = document.getElementById("appMain");
        this.rbar = document.getElementById("appRightSidebar");
        this.footer = document.getElementById("appFooter");
    }

    private getPosition(position: AppPositions): HTMLElement {
        switch (position) {
            case AppPositions.header:
                return this.header;
            case AppPositions.main:
                return this.main;
            case AppPositions.lbar:
                return this.lbar;
            case AppPositions.rbar:
                return this.rbar;
            case AppPositions.footer:
                return this.footer;
        }
    }

    addUI(position: AppPositions, element: HTMLElement | DocumentFragment) {
        const pos = this.getPosition(position);
        pos.appendChild(element);
    }

    replaceUI(position: AppPositions, element: HTMLElement | DocumentFragment) {
        const pos = this.getPosition(position);
        const range = document.createRange();
        range.selectNodeContents(pos);
        range.deleteContents(); 
        pos.appendChild(element);
    }


    static Run() {
        const app = new App();
        window["app"] = app;
    }
}


export function GetApp() : App {
    return <App>window["app"];
}