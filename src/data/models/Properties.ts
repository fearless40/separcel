
interface Property {
    readonly id: string
    value: string | number | Array<string> | Array<number>
}

interface Properties {
    //properties? : Map<string, Property>
    getProperty(id:string) : Property 
}