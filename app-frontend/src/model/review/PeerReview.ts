import {User} from "../user/User";

export interface PeerReview {
    id: number,
    content: string,
    reviewer: User,
    reviewed: User,
}