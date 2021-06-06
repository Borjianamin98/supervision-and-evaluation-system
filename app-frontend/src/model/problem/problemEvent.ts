import {Role} from "../enum/role";

export interface Auditable {
    createdBy: string,
    createdByRole: Role,
    createdDate: string,
}

export interface ProblemEvent extends Auditable {
    id: number,
    message: string,
}

export interface ProblemEventSave {
    message: string,
}