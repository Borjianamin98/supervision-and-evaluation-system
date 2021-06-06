package ir.ac.sbu.evaluation.dto.schedule.event;

import ir.ac.sbu.evaluation.dto.user.UserDto;
import ir.ac.sbu.evaluation.model.schedule.ScheduleEvent;
import java.time.Instant;
import java.util.Objects;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ScheduleEventDto {

    private long id;
    private Instant startDate;
    private Instant endDate;
    private UserDto owner;

    public ScheduleEventDto() {
    }

    @Builder
    public ScheduleEventDto(long id, Instant startDate, Instant endDate, UserDto owner) {
        this.id = id;
        this.startDate = startDate;
        this.endDate = endDate;
        this.owner = owner;
    }

    public static ScheduleEventDto from(ScheduleEvent scheduleEvent) {
        return ScheduleEventDto.builder()
                .id(scheduleEvent.getId())
                .startDate(scheduleEvent.getStartDate()).endDate(scheduleEvent.getEndDate())
                .owner(UserDto.from(scheduleEvent.getOwner()))
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
        ScheduleEventDto that = (ScheduleEventDto) o;
        return id == that.id && Objects.equals(startDate, that.startDate)
                && Objects.equals(endDate, that.endDate)
                && Objects.equals(owner, that.owner);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, startDate, endDate, owner);
    }
}
