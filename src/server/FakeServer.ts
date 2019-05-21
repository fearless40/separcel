import { ServerConnection, Message, MessageTypes } from "./ServerProtocol"
import {EventSimple} from "../util/EventSimple"


class FakeServer implements ServerConnection {
    delay_fake: boolean = false
    delay_min: number = 0
    delay_max: number = 500
    delay_always: boolean = false


    constructor() {

    }

    private do_delay(func: any, arg: any) : Promise<any> {
        if (!this.delay_fake) {
            return new Promise<Message>(resolve => func(arg) );
        }
        else {
            return new Promise<Message>(resolve => setTimeout(() => func(arg), this.delay_max));
        }

    }

    onMessage = new EventSimple<Message>();

    private route(msg: Message) : Message{
        if (msg.msgType == MessageTypes.get) {
            return this.route_get(msg);
        }
        else if (msg.msgType == MessageTypes.post) {
            return this.route_post(msg);
        }
    }

    private route_get(msg: Message) : Message{
        const values = JSON.parse(msg.value);
        if (values.payload_type) {
            if (values.data_type) {
                return this.enumerate_slot_types();
            }
        }
    }

    private enumerate_slot_types(): Message {
        return {
            time_stamp: new Date(),
            msgType: MessageTypes.reply,
            value: JSON.stringify(["default"])
        }
    }
    
    private route_post(msg: Message) : Message {

    }

    send(msg: Message): Promise<Message> {
        return promise;
    }
    connect(): Promise<boolean>;
    disconnect(): void;
}