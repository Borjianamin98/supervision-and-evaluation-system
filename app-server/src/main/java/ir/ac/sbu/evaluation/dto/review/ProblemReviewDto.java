package ir.ac.sbu.evaluation.dto.review;

import ir.ac.sbu.evaluation.dto.user.UserDto;
import ir.ac.sbu.evaluation.model.review.ProblemReview;
import java.util.Objects;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProblemReviewDto {

    private long id;
    private int score;
    private UserDto reviewer;

    @Builder
    public ProblemReviewDto(long id,
            int score,
            UserDto reviewer) {
        this.id = id;
        this.score = score;
        this.reviewer = reviewer;
    }

    public static ProblemReviewDto from(ProblemReview problemReview) {
        return ProblemReviewDto.builder()
                .id(problemReview.getId())
                .score(problemReview.getScore())
                .reviewer(UserDto.from(problemReview.getReviewer()))
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
        ProblemReviewDto that = (ProblemReviewDto) o;
        return id == that.id
                && score == that.score
                && Objects.equals(reviewer, that.reviewer);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, score, reviewer);
    }
}
