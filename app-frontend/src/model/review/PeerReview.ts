import {User} from "../user/User";

export interface PeerReview {
    id: number,
    content: string,
    score: number,
    reviewer: User,
    reviewed: User,
}