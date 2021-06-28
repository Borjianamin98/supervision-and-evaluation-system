package ir.ac.sbu.evaluation.dto.notification;

import ir.ac.sbu.evaluation.dto.AuditableDto;
import ir.ac.sbu.evaluation.model.notification.Notification;
import java.time.Instant;
import java.util.Objects;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotificationDto extends AuditableDto {

    private long id;
    private String content;
    private boolean seen;

    public NotificationDto() {
    }

    @Builder
    public NotificationDto(
            String createdBy,
            String createdByRole,
            Instant createdDate,
            long id,
            String content,
            boolean seen) {
        super(createdBy, createdByRole, createdDate);
        this.id = id;
        this.content = content;
        this.seen = seen;
    }

    public static NotificationDto from(Notification notification) {
        return NotificationDto.builder()
                .id(notification.getId())
                .content(notification.getContent())
                .seen(notification.getSeen())
                .createdBy(notification.getCreatedBy())
                .createdByRole(notification.getCreatedByRole())
                .createdDate(notification.getCreatedDate())
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
        if (!super.equals(o)) {
            return false;
        }
        NotificationDto that = (NotificationDto) o;
        return id == that.id && seen == that.seen && Objects.equals(content, that.content);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), id, content, seen);
    }
}
