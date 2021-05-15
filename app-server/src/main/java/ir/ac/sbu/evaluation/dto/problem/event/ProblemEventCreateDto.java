package ir.ac.sbu.evaluation.dto.problem.event;

import ir.ac.sbu.evaluation.model.problem.ProblemEvent;
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
}
