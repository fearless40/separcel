
export function isWidget(item: any): item is Widget {
    if (<Widget>item.render !== undefined && <Widget>item.children !== undefined)
        return true;
    return false;
}

export interface Widget {
    root: HTMLElement;
    render() :  HTMLElement;
    children() : HTMLElement[];
 }