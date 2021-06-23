package ir.ac.sbu.evaluation.model.review;

import ir.ac.sbu.evaluation.model.BaseEntity;
import ir.ac.sbu.evaluation.model.problem.Problem;
import ir.ac.sbu.evaluation.model.user.Master;
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
@Table(name = "problem_review")
public class ProblemReview extends BaseEntity {

    @Column(name = "score")
    private int score;

    @ManyToOne
    @JoinColumn(name = "reviewer_id")
    private Master reviewer;

    @ManyToOne
    @JoinColumn(name = "problem_id")
    private Problem problem;

    public ProblemReview() {
    }

    @Builder
    public ProblemReview(Long id,
            int score,
            Master reviewer,
            Problem problem) {
        super(id);
        this.score = score;
        this.reviewer = reviewer;
        this.problem = problem;
    }
}
