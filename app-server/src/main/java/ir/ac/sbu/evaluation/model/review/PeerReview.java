package ir.ac.sbu.evaluation.model.review;

import ir.ac.sbu.evaluation.model.Auditable;
import ir.ac.sbu.evaluation.model.problem.Problem;
import ir.ac.sbu.evaluation.model.user.Master;
import java.time.Instant;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "peer_review")
public class PeerReview extends Auditable {

    @Column(name = "content", length = 255)
    private String content;

    @Column(name = "score")
    private Integer score;

    @ManyToOne
    @JoinColumn(name = "reviewer_id")
    private Master reviewer;

    @ManyToOne
    @JoinColumn(name = "reviewed_id")
    private Master reviewed;

    @ManyToOne
    @JoinColumn(name = "problem_id")
    private Problem problem;

    public PeerReview() {
    }

    @Builder
    public PeerReview(Long id, String createdBy, Instant createdDate, String content, Integer score,
            Master reviewer, Master reviewed, Problem problem) {
        super(id, createdBy, createdDate);
        this.content = content;
        this.score = score;
        this.reviewer = reviewer;
        this.reviewed = reviewed;
        this.problem = problem;
    }
}
