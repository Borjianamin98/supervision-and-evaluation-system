import {Auditable} from "../Auditable";

export interface ProblemEvent extends Auditable {
    id: number,
    message: string,
    hasAttachment: boolean,
    attachmentContentType: string,
    attachmentLink: string,
}