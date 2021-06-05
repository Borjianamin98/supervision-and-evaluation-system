package ir.ac.sbu.evaluation.dto.schedule.event;

import ir.ac.sbu.evaluation.dto.user.UserDto;
import ir.ac.sbu.evaluation.model.schedule.ScheduleEvent;
import java.time.Instant;
import java.util.Objects;
import javax.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ScheduleEventInfoDto {

    private long id;

    @NotNull
    private Instant startDate;

    @NotNull
    private Instant endDate;

    @NotNull
    private UserDto owner;

    public ScheduleEventInfoDto() {
    }

    @Builder
    public ScheduleEventInfoDto(long id, Instant startDate, Instant endDate, UserDto owner) {
        this.id = id;
        this.startDate = startDate;
        this.endDate = endDate;
        this.owner = owner;
    }

    public static ScheduleEventInfoDto from(ScheduleEvent scheduleEvent) {
        return ScheduleEventInfoDto.builder()
                .id(scheduleEvent.getId())
                .startDate(scheduleEvent.getStartDate()).endDate(scheduleEvent.getEndDate())
                .owner(UserDto.from(scheduleEvent.getOwner()))
                .build();
    }

    public ScheduleEvent toScheduleEvent() {
        return ScheduleEvent.builder()
                .id(id)
                .startDate(startDate).endDate(endDate)
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
        ScheduleEventInfoDto that = (ScheduleEventInfoDto) o;
        return id == that.id && Objects.equals(startDate, that.startDate) && Objects
                .equals(endDate, that.endDate) && Objects.equals(owner, that.owner);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, startDate, endDate, owner);
    }
}
