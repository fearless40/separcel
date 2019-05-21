
export class ScheduleOwner implements Properties {
    getProperty(id: string): Property {
        throw new Error("Method not implemented.");
    }
    readonly id: string
    display: string
    fullname: string
    properties? : Map<string, Property>
}