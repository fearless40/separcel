
export class EventDefinition implements Properties {
    getProperty(id: string): Property {
        return { id: "yo", value: "yo" }
    }

    constructor(readonly id: string,
        readonly display: string,
        readonly owner: EventGroup,
        readonly isTemp: boolean) {

    }
}

export interface EventGroupForEachCB {
    (value: EventDefinition, index : number) : void
}

/*export interface EventGroup {
    readonly id: string
//    has(id: string): boolean
    add(id: string, display?: string, props?: Properties): void;
    validate(id:string):boolean
    get(id: string): EventDefinition
    forEach(cb : EventGroupForEachCB) : void
}*/

export class EventGroup {
    id: string
    events: Map<string, EventDefinition>
    static readonly NullEvent : EventDefinition 

    create(id: string, display?: string, props?: Properties): EventDefinition {

    }

    has(id: string) {

    }

    match(id: string, match_loose: boolean): EventDefinition {

    }

    get(id: string): EventDefinition {

    }
}