import {PeerReviewSave} from "./PeerReviewSave";

export interface ProblemReviewSave {
    score: number,
    peerReviews: PeerReviewSave[],
}