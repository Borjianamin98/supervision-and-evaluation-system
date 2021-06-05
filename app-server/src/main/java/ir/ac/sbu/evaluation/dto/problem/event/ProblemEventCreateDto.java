package ir.ac.sbu.evaluation.dto.problem.event;

import ir.ac.sbu.evaluation.model.problem.ProblemEvent;
import java.util.Objects;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProblemEventCreateDto {

    @NotBlank
    @Size(max = 1000)
    private String message;

    public ProblemEventCreateDto() {
    }

    @Builder
    public ProblemEventCreateDto(String message) {
        this.message = message;
    }

    public ProblemEvent toProblemEvent() {
        return ProblemEvent.builder()
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
        ProblemEventCreateDto that = (ProblemEventCreateDto) o;
        return Objects.equals(message, that.message);
    }

    @Override
    public int hashCode() {
        return Objects.hash(message);
    }
}
