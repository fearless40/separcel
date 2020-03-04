
interface IProperty {
    readonly id: string
    value: string | number; 
}

interface IProperties {
    //properties? : Map<string, Property>
    property_set(id: string, value : string | number): IProperty
    property_get(id: string): IProperty
    property_getAll() : Array<IProperty>
}


class Property implements IProperty {
    constructor(public readonly id: string, public value: string | number) {}
}

class Properties implements IProperties {
    private mProperties : Map<string, string | number>

    constructor() {
        this.mProperties = new Map<string, string | number>();
    }

    property_getAll(): IProperty[] {
        let val = new Array<IProperty>();
        this.mProperties.forEach((value, key) => { val.push(new Property(key, value)) });
        return val;
    }


    property_set(id: string, value: string | number): IProperty {
        this.mProperties.set(id, value);
    }
    property_get(id: string): IProperty {
        
    }


}