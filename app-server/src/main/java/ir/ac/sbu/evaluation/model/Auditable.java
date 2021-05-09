package ir.ac.sbu.evaluation.model;

import java.time.Instant;
import javax.persistence.Column;
import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Getter
@Setter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public class Auditable extends BaseEntity {

    @CreatedBy
    @Column(name = "created_by")
    private String createdBy;

    @CreatedDate
    @Column(name = "created_date", nullable = false, updatable = false)
    private Instant createdDate; // ISO-8601 representation

    public Auditable() {
    }

    @Builder(builderMethodName = "auditableBuilder")
    public Auditable(Long id, String createdBy, Instant createdDate) {
        super(id);
        this.createdBy = createdBy;
        this.createdDate = createdDate;
    }
}
