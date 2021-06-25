package ir.ac.sbu.evaluation.dto.problem.event;

import static ir.ac.sbu.evaluation.controller.ApiPaths.API_PROBLEM_ROOT_PATH;

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
    private String attachmentExtension;
    private String attachmentLink;

    public ProblemEventDto() {
    }

    @Builder
    public ProblemEventDto(
            String createdBy,
            String createdByRole,
            Instant createdDate,
            long id,
            String message,
            boolean hasAttachment,
            String attachmentContentType,
            String attachmentExtension,
            String attachmentLink) {
        super(createdBy, createdByRole, createdDate);
        this.id = id;
        this.message = message;
        this.hasAttachment = hasAttachment;
        this.attachmentContentType = attachmentContentType;
        this.attachmentExtension = attachmentExtension;
        this.attachmentLink = attachmentLink;
    }

    public static ProblemEventDto from(ProblemEvent problemEvent) {
        return ProblemEventDto.builder()
                .id(problemEvent.getId())
                .message(problemEvent.getMessage())
                .hasAttachment(problemEvent.getHasAttachment())
                .attachmentContentType(problemEvent.getAttachmentContentType())
                .attachmentExtension(problemEvent.getAttachmentExtension())
                .attachmentLink(problemEvent.getHasAttachment() ? String.format("%s/%s/events/%s/attachment",
                        API_PROBLEM_ROOT_PATH, problemEvent.getProblem().getId(), problemEvent.getId()) : "")
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
                && Objects.equals(attachmentContentType, that.attachmentContentType)
                && Objects.equals(attachmentExtension, that.attachmentExtension);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, message, hasAttachment, attachmentContentType);
    }
}
