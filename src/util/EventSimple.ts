
export interface Listener<Arg> {
    (event: Arg): boolean;
}

export interface IEventSimple<Arg> {
    addListener(callback: Listener<Arg>): void 
    removeListener(callback: Listener<Arg>): void 
    //fire(argument: Arg): void 
}

export class EventSimple<Arg> implements IEventSimple<Arg>{
    
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