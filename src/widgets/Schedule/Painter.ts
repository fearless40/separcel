import {LayoutItem} from "../../layout/Layout"
import { DataView } from "../../data/Data";

export interface PaintInformation {
    value: string
    row: number
    col: number
    owner: DataView
    id: number
}

export interface PainterCallback {
    (element: HTMLElement, data: PaintInformation): void;
}

export interface Painter {
    paint: PainterCallback;
}

