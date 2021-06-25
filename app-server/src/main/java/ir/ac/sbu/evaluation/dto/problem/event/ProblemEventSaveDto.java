package ir.ac.sbu.evaluation.dto.problem.event;

import ir.ac.sbu.evaluation.model.problem.ProblemEvent;
import java.util.Objects;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class ProblemEventSaveDto {

    @NotBlank
    @Size(max = 1000)
    private String message;

    private MultipartFile attachment;

    public ProblemEventSaveDto() {
    }

    @Builder
    public ProblemEventSaveDto(String message, MultipartFile attachment) {
        this.message = message;
        this.attachment = attachment;
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
        ProblemEventSaveDto that = (ProblemEventSaveDto) o;
        return Objects.equals(message, that.message);
    }

    @Override
    public int hashCode() {
        return Objects.hash(message);
    }
}
