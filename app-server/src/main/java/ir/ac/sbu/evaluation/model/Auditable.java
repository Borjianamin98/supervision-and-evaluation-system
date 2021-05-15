package ir.ac.sbu.evaluation.model;

import ir.ac.sbu.evaluation.security.AuthUserDetail;
import java.time.Instant;
import java.util.Optional;
import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.PrePersist;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Getter
@Setter
@MappedSuperclass
public class Auditable extends BaseEntity {

    @CreatedBy
    @Column(name = "created_by")
    private String createdBy;

    @CreatedBy
    @Column(name = "created_by_role")
    private String createdByRole;

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

    @PrePersist
    public void prePersist() {
        Optional<AuthUserDetail> createdByUser = getAuthenticatedUser();
        this.createdBy = createdByUser.map(AuthUserDetail::getFullName).orElse(null);
        this.createdByRole = createdByUser.map(AuthUserDetail::getRole).orElse(null);
        this.createdDate = Instant.now();
    }

    private Optional<AuthUserDetail> getAuthenticatedUser() {
        return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .map(Authentication::getPrincipal).map(principle -> (AuthUserDetail) principle);
    }
}
