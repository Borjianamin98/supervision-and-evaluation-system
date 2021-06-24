import {Auditable} from "../../Auditable";
import {User} from "../../user/User";

export interface PeerReview extends Auditable {
    id: number,
    content: string,
    score: number,
    reviewer: User,
    reviewed: User,
}