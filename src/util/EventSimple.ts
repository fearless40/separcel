
export interface Listener<Arg> {
    (event: Arg): boolean;
}

export class EventSimple<Arg> {
    
    private mCallBacks: Set<Listener<Arg>>;
    constructor() {
        this.mCallBacks = new Set<Listener<Arg>>();
    }

    addListener(callback: Listener<Arg>): void {
        this.mCallBacks.add(callback);
    }

    removeListener(callback: Listener<Arg>): void {
        this.mCallBacks.delete(callback);
    }

    fire(argument: Arg): void {
        this.mCallBacks.forEach((value: Listener<Arg>) => value(argument));
    }
}