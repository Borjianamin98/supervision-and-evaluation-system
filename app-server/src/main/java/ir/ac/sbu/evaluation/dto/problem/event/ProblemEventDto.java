package ir.ac.sbu.evaluation.dto.problem.event;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import ir.ac.sbu.evaluation.dto.AuditableDto;
import ir.ac.sbu.evaluation.model.problem.ProblemEvent;
import java.time.Instant;
import java.util.Objects;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProblemEventDto extends AuditableDto {

    @JsonProperty(access = Access.READ_ONLY)
    private long id;

    @NotBlank
    @Size(max = 1000)
    private String message;

    public ProblemEventDto() {
    }

    @Builder
    public ProblemEventDto(String createdBy, String createdByRole, Instant createdDate, long id, String message) {
        super(createdBy, createdByRole, createdDate);
        this.id = id;
        this.message = message;
    }

    public static ProblemEventDto from(ProblemEvent problemEvent) {
        return ProblemEventDto.builder()
                .id(problemEvent.getId())
                .message(problemEvent.getMessage())
                .createdBy(problemEvent.getCreatedBy())
                .createdByRole(problemEvent.getCreatedByRole())
                .createdDate(problemEvent.getCreatedDate())
                .build();
    }

    public ProblemEvent toProblemEvent() {
        return ProblemEvent.builder()
                .id(id)
                .message(message)
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
        ProblemEventDto that = (ProblemEventDto) o;
        return id == that.id && Objects.equals(message, that.message);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, message);
    }
}
