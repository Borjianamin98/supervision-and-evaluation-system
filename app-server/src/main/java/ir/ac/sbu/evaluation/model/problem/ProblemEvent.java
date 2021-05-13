package ir.ac.sbu.evaluation.model.problem;

import ir.ac.sbu.evaluation.model.Auditable;
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
@Table(name = "event")
public class ProblemEvent extends Auditable {

    @Column(name = "message", length = 1000, nullable = false, updatable = false)
    private String message;

    @ManyToOne
    @JoinColumn(name = "problem_id")
    private Problem problem;

    public ProblemEvent() {
    }

    @Builder
    public ProblemEvent(Long id, String createdBy, Instant createdDate,
            String message, Problem problem) {
        super(id, createdBy, createdDate);
        this.message = message;
        this.problem = problem;
    }
}
