package ir.ac.sbu.evaluation.dto.schedule;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import ir.ac.sbu.evaluation.model.schedule.ScheduleEvent;
import java.time.Instant;
import javax.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ScheduleEventDto {

    @JsonProperty(access = Access.READ_ONLY)
    private long id;

    @NotNull
    private String subject;

    @NotNull
    private Instant startDate; // ISO-8601 representation

    @NotNull
    private Instant endDate; // ISO-8601 representation

    @NotNull
    private Boolean isAllDay;

    @NotNull
    private long ownerId;

    public ScheduleEventDto() {
    }

    @Builder
    public ScheduleEventDto(long id, String subject,
            Instant startDate, Instant endDate,
            Boolean isAllDay, long ownerId) {
        this.id = id;
        this.subject = subject;
        this.startDate = startDate;
        this.endDate = endDate;
        this.isAllDay = isAllDay;
        this.ownerId = ownerId;
    }

    public static ScheduleEventDto from(ScheduleEvent scheduleEvent) {
        return ScheduleEventDto.builder()
                .id(scheduleEvent.getId())
                .subject(scheduleEvent.getSubject())
                .startDate(scheduleEvent.getStartDate()).endDate(scheduleEvent.getEndDate())
                .isAllDay(scheduleEvent.isAllDay())
                .ownerId(scheduleEvent.getOwner().getId())
                .build();
    }

    public ScheduleEvent toScheduleEvent() {
        return ScheduleEvent.builder()
                .id(id)
                .subject(subject)
                .startDate(startDate).endDate(endDate)
                .isAllDay(isAllDay)
                .build();
    }
}
