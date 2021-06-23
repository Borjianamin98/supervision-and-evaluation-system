package ir.ac.sbu.evaluation.model.review;

import ir.ac.sbu.evaluation.model.BaseEntity;
import ir.ac.sbu.evaluation.model.problem.Problem;
import ir.ac.sbu.evaluation.model.user.User;
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
public class PeerReview extends BaseEntity {

    @Column(name = "content", length = 255)
    private String content;

    @Column(name = "score")
    private Integer score;

    @ManyToOne
    @JoinColumn(name = "reviewer_id")
    private User reviewer;

    @ManyToOne
    @JoinColumn(name = "reviewed_id")
    private User reviewed;

    @ManyToOne
    @JoinColumn(name = "problem_id")
    private Problem problem;

    public PeerReview() {
    }

    @Builder
    public PeerReview(Long id,
            String content,
            Integer score,
            User reviewer,
            User reviewed,
            Problem problem) {
        super(id);
        this.content = content;
        this.score = score;
        this.reviewer = reviewer;
        this.reviewed = reviewed;
        this.problem = problem;
    }
}
