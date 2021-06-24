package ir.ac.sbu.evaluation.dto.review.peer;

import ir.ac.sbu.evaluation.model.review.PeerReview;
import java.util.Objects;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PeerReviewSaveDto {

    @NotBlank
    @Size(max = 255)
    private String content;

    @Min(value = 1)
    @Max(value = 5)
    private int score;

    @Min(value = 1)
    private long reviewedId;

    public PeerReviewSaveDto() {
    }

    @Builder
    public PeerReviewSaveDto(
            String content,
            int score,
            long reviewedId) {
        this.content = content;
        this.score = score;
        this.reviewedId = reviewedId;
    }

    public PeerReview toPeerReview() {
        return PeerReview.builder()
                .content(content)
                .score(score)
                .build();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        PeerReviewSaveDto that = (PeerReviewSaveDto) o;
        return Objects.equals(content, that.content)
                && score == that.score
                && reviewedId == that.reviewedId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(content, score, reviewedId);
    }
}
