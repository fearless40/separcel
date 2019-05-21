

export class FloatingTextInput {
    private element : HTMLInputElement
    private textEditMode: boolean;
    private dirty: boolean;
    private codeSetValue: boolean;

    constructor() {
        this.element = document.createElement("input");
        this.element.type = "text"
        this.element.classList.add("widget-input-text")
        this.element.addEventListener('input', this.onInput);
    }

    get root(): HTMLElement {
        return this.element;
    }

    show(parent: HTMLElement, value : string): void {
        this.codeSetValue = true;
        this.hide();
        this.element.value = value;
        parent.appendChild(this.element);
        this.element.select();
        this.element.focus();
        this.dirty = false;
        this.codeSetValue = false;
    }

    hide(): void {
        if (this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }

    dirty_reset(): void {
        this.dirty = false;
    }

    get isDirty(): boolean {
        return this.dirty;
    }

    get value(): string {
        return this.element.value;
    }

    onInput = (e: any): void => {
        if (e.data && !this.codeSetValue) {
            this.dirty = true;
        }
    }

    //setTimeout(() => this.element.selectionStart = this.element.selectionEnd = this.element.value.length + 2, 0);
}