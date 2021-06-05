package ir.ac.sbu.evaluation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import java.time.Instant;
import java.util.Objects;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuditableDto {

    @JsonProperty(access = Access.READ_ONLY)
    private String createdBy;

    @JsonProperty(access = Access.READ_ONLY)
    private String createdByRole;

    @JsonProperty(access = Access.READ_ONLY)
    private Instant createdDate; // ISO-8601 representation

    public AuditableDto() {
    }

    @Builder(builderMethodName = "auditableDtoBuilder")
    public AuditableDto(String createdBy, String createdByRole, Instant createdDate) {
        this.createdBy = createdBy;
        this.createdByRole = createdByRole;
        this.createdDate = createdDate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        AuditableDto that = (AuditableDto) o;
        return Objects.equals(createdBy, that.createdBy) && Objects
                .equals(createdByRole, that.createdByRole) && Objects.equals(createdDate, that.createdDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(createdBy, createdByRole, createdDate);
    }
}
