
export interface RenderFunction {
    (): HTMLElement;
}



export interface Widget {
    root: HTMLElement;
    render() :  HTMLElement;
    children() : HTMLElement[];
}

export function isWidget(item: any): item is Widget {
    if (<Widget>item.render !== undefined && <Widget>item.children !== undefined)
        return true;
    return false;
}



export type Content = Widget | HTMLElement | RenderFunction | DocumentFragment;

export function renderContent(content: Content): HTMLElement | DocumentFragment{
    if (isWidget(content)) {
        return content.render();
    }

    if (content instanceof HTMLElement) {
        return content;
    }

    if (content instanceof DocumentFragment) {
        return content;
    }

    return content();
}
