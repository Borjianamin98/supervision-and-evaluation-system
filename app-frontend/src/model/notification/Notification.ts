import {Auditable} from "../Auditable";

export interface AppNotification extends Auditable {
    id: number,
    content: string,
    seen: boolean,
}