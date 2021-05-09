package ir.ac.sbu.evaluation.model.problem;

import ir.ac.sbu.evaluation.model.Auditable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "event")
public class ProblemEvent extends Auditable {

    @Column(name = "message", nullable = false, updatable = false)
    private String message;

    public ProblemEvent() {
    }

    @Builder
    public ProblemEvent(Long id, String message) {
        super(id);
        this.message = message;
    }
}