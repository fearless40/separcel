import * as Layout from "./Layout"
import {MetaTypes, MetaLayout, SearchForPseudoElements } from "./MetaData"
import {TableRange} from "./Helpers"
import { Cell2d } from "./Cell";


export class LayoutTable extends Layout.Vertical {
    private meta : Set<MetaLayout>;


    constructor(autoExpand: boolean = true) {
        super(false, autoExpand);
    }

    metaData_exists(type: MetaTypes): boolean {
        const values = this.meta.values();
        for (let v of values) {
            if (v.type == type) {
                return true;
            }
        }
        return false;
    }

    metaData_get(type: MetaTypes): MetaLayout[] {
        let meta_array = new Array<MetaLayout>();
        const values = this.meta.values();
        for (let v of values) {
            if (v.type == type) {
                meta_array.push(v);
            }
        }
        return meta_array;
    }

    toGrid(): Cell2d {
        let ret = super.toGrid();
        this.meta = SearchForPseudoElements(ret);
        return ret;
    }
   
}
