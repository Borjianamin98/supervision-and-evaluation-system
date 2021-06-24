import {PeerReviewSave} from "./peer/PeerReviewSave";

export interface ProblemReviewSave {
    score: number,
    peerReviews: PeerReviewSave[],
}