package ir.ac.sbu.evaluation.dto.review;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import ir.ac.sbu.evaluation.dto.user.master.MasterDto;
import ir.ac.sbu.evaluation.model.review.ProblemReview;
import java.util.Objects;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(Include.NON_NULL)
public class ProblemReviewDto {

    private long id;
    private Integer score;
    private MasterDto reviewer;

    @Builder
    public ProblemReviewDto(long id,
            Integer score,
            MasterDto reviewer) {
        this.id = id;
        this.score = score;
        this.reviewer = reviewer;
    }

    public static ProblemReviewDto from(ProblemReview problemReview, boolean hasSensitive) {
        return ProblemReviewDto.builder()
                .id(problemReview.getId())
                .score(hasSensitive ? problemReview.getScore() : null)
                .reviewer(MasterDto.from(problemReview.getReviewer()))
                .build();
    }

    public static ProblemReviewDto from(ProblemReview problemReview) {
        return from(problemReview, false);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        ProblemReviewDto that = (ProblemReviewDto) o;
        return id == that.id
                && Objects.equals(score, that.score)
                && Objects.equals(reviewer, that.reviewer);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, score, reviewer);
    }
}
