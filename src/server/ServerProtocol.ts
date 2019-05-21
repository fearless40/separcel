import { EventSimple } from "../util/EventSimple";

export const enum MessageTypes {
    get,
    post,
    connect,
    disconnect,
    reply
}

export interface Message {
    time_stamp: Date
    msgType: MessageTypes
    value: string
}



export interface ServerConnection {
    onMessage: EventSimple<Message>;
    send(msg: Message) : Promise<Message>;
    connect(): Promise<boolean>;
    disconnect(): void;
}