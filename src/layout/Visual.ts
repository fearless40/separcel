
interface Visual {
    asClassName() : string
}


class VisualClass implements Visual {

    asClassName(): string {
        return this.mClass;
    }

    constructor(private mClass: string) {

    }

}


