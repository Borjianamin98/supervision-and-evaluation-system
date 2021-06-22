package ir.ac.sbu.evaluation.dto.review;

import ir.ac.sbu.evaluation.dto.user.UserDto;
import ir.ac.sbu.evaluation.model.review.PeerReview;
import java.util.Objects;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PeerReviewDto {

    private long id;
    private String content;
    private UserDto reviewer;
    private UserDto reviewed;

    @Builder
    public PeerReviewDto(long id,
            String content,
            UserDto reviewer,
            UserDto reviewed) {
        this.id = id;
        this.content = content;
        this.reviewer = reviewer;
        this.reviewed = reviewed;
    }

    public static PeerReviewDto from(PeerReview peerReview) {
        return PeerReviewDto.builder()
                .id(peerReview.getId())
                .content(peerReview.getContent())
                .reviewer(UserDto.from(peerReview.getReviewer()))
                .reviewed(UserDto.from(peerReview.getReviewed()))
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
        PeerReviewDto that = (PeerReviewDto) o;
        return id == that.id
                && Objects.equals(content, that.content)
                && Objects.equals(reviewer, that.reviewer)
                && Objects.equals(reviewed, that.reviewed);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, content, reviewer, reviewed);
    }
}
