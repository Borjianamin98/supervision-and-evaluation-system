package ir.ac.sbu.evaluation.dto.review.peer;

import ir.ac.sbu.evaluation.dto.AuditableDto;
import ir.ac.sbu.evaluation.dto.user.master.MasterDto;
import ir.ac.sbu.evaluation.model.review.PeerReview;
import java.time.Instant;
import java.util.Objects;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PeerReviewDto extends AuditableDto {

    private long id;
    private String content;
    private int score;
    private MasterDto reviewer;
    private MasterDto reviewed;

    @Builder
    public PeerReviewDto(String createdBy,
            String createdByRole,
            Instant createdDate,
            long id,
            String content,
            int score,
            MasterDto reviewer,
            MasterDto reviewed) {
        super(createdBy, createdByRole, createdDate);
        this.id = id;
        this.content = content;
        this.score = score;
        this.reviewer = reviewer;
        this.reviewed = reviewed;
    }

    public static PeerReviewDto from(PeerReview peerReview) {
        return PeerReviewDto.builder()
                .id(peerReview.getId())
                .content(peerReview.getContent())
                .score(peerReview.getScore())
                .reviewer(MasterDto.from(peerReview.getReviewer()))
                .reviewed(MasterDto.from(peerReview.getReviewed()))
                .createdBy(peerReview.getCreatedBy())
                .createdByRole(peerReview.getCreatedByRole())
                .createdDate(peerReview.getCreatedDate())
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
                && score == that.score
                && Objects.equals(reviewer, that.reviewer)
                && Objects.equals(reviewed, that.reviewed);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, content, score, reviewer, reviewed);
    }
}
