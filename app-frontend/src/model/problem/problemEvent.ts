import {Auditable} from "../Auditable";

export interface ProblemEvent extends Auditable {
    id: number,
    message: string,
}

export interface ProblemEventSave {
    message: string,
}