import {User} from "../user/User";

export interface ProblemReview {
    id: number,
    score: number,
    reviewer: User,
}