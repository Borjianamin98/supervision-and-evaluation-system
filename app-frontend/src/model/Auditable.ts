import {Role} from "./enum/role";

export interface Auditable {
    createdBy: string,
    createdByRole: Role,
    createdDate: string,
}