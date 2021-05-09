package ir.ac.sbu.evaluation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import java.time.Instant;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuditableDto {

    @JsonProperty(access = Access.READ_ONLY)
    private String createdBy;

    @JsonProperty(access = Access.READ_ONLY)
    private Instant createdDate; // ISO-8601 representation

    public AuditableDto() {
    }

    @Builder(builderMethodName = "auditableDtoBuilder")
    public AuditableDto(String createdBy, Instant createdDate) {
        this.createdBy = createdBy;
        this.createdDate = createdDate;
    }
}
