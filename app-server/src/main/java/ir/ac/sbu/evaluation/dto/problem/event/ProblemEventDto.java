package ir.ac.sbu.evaluation.dto.problem.event;

import ir.ac.sbu.evaluation.dto.AuditableDto;
import ir.ac.sbu.evaluation.model.problem.ProblemEvent;
import java.time.Instant;
import java.util.Objects;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProblemEventDto extends AuditableDto {

    private long id;
    private String message;
    private boolean hasAttachment;
    private String attachmentContentType;

    public ProblemEventDto() {
    }

    @Builder
    public ProblemEventDto(String createdBy, String createdByRole, Instant createdDate, long id, String message,
            boolean hasAttachment, String attachmentContentType) {
        super(createdBy, createdByRole, createdDate);
        this.id = id;
        this.message = message;
        this.hasAttachment = hasAttachment;
        this.attachmentContentType = attachmentContentType;
    }

    public static ProblemEventDto from(ProblemEvent problemEvent) {
        return ProblemEventDto.builder()
                .id(problemEvent.getId())
                .message(problemEvent.getMessage())
                .hasAttachment(problemEvent.getHasAttachment())
                .attachmentContentType(problemEvent.getAttachmentContentType())
                .createdBy(problemEvent.getCreatedBy())
                .createdByRole(problemEvent.getCreatedByRole())
                .createdDate(problemEvent.getCreatedDate())
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
        return id == that.id
                && Objects.equals(message, that.message)
                && hasAttachment == that.hasAttachment
                && Objects.equals(attachmentContentType, that.attachmentContentType);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, message, hasAttachment, attachmentContentType);
    }
}
