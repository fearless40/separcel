import { Container } from "./container";

export interface IContainerRender<TDataType> {
    place(container : Container, data: TDataType): void;
    verify(data : any) : boolean
}