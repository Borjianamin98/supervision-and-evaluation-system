package ir.ac.sbu.evaluation.dto.review.peer;

import java.util.Map;
import java.util.Objects;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.Page;

@Getter
@Setter
public class AggregatedPeerReviewsDto {

    private double averageScore;
    private Map<Integer /* score */, Long /* count */> scoresCount;
    private Page<PeerReviewDto> peerReviews;

    @Builder
    public AggregatedPeerReviewsDto(double averageScore, Map<Integer, Long> scoresCount,
            Page<PeerReviewDto> peerReviews) {
        this.averageScore = averageScore;
        this.scoresCount = scoresCount;
        this.peerReviews = peerReviews;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        AggregatedPeerReviewsDto that = (AggregatedPeerReviewsDto) o;
        return Double.compare(that.averageScore, averageScore) == 0
                && Objects.equals(scoresCount, that.scoresCount);
    }

    @Override
    public int hashCode() {
        return Objects.hash(averageScore, scoresCount);
    }
}
