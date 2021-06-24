import {Pageable} from "../../api/Pageable";
import {PeerReview} from "./PeerReview";

export interface AggregatedPeerReviews {
    averageScore: number,
    scoresCount: { [key: number]: number },
    peerReviews: Pageable<PeerReview>
}