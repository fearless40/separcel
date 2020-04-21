
export interface Widget {
    root: HTMLElement;
    render() :  DocumentFragment;
    children() : HTMLElement[];
    onAttach? : (parent : HTMLElement) => void
    onDetach?: () => void
 }