package ir.ac.sbu.evaluation.dto.review;

import java.util.Objects;
import java.util.Set;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProblemReviewSaveDto {

    @Min(value = 0)
    @Max(value = 20)
    private double score;

    @NotNull
    @Size(min = 1)
    private Set<PeerReviewSaveDto> peerReviews;

    public ProblemReviewSaveDto() {
    }

    @Builder
    public ProblemReviewSaveDto(double score, Set<PeerReviewSaveDto> peerReviews) {
        this.score = score;
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
        ProblemReviewSaveDto that = (ProblemReviewSaveDto) o;
        return Double.compare(that.score, score) == 0
                && Objects.equals(peerReviews, that.peerReviews);
    }

    @Override
    public int hashCode() {
        return Objects.hash(score, peerReviews);
    }
}
