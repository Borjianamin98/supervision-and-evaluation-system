package ir.ac.sbu.evaluation.dto.schedule;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import ir.ac.sbu.evaluation.model.schedule.MeetSchedule;
import ir.ac.sbu.evaluation.model.schedule.ScheduleState;
import java.time.Instant;
import java.util.Objects;
import java.util.Set;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(Include.NON_NULL)
public class MeetScheduleDto {

    private long id;
    private long durationMinutes;
    private Instant minimumDate;
    private Instant maximumDate;
    private ScheduleState scheduleState;
    private Instant finalizedDate;

    private Set<Long> verifiedUsers;

    public MeetScheduleDto() {
    }

    @Builder
    public MeetScheduleDto(long id, long durationMinutes, Instant minimumDate, Instant maximumDate,
            ScheduleState scheduleState, Instant finalizedDate, Set<Long> verifiedUsers) {
        this.id = id;
        this.durationMinutes = durationMinutes;
        this.minimumDate = minimumDate;
        this.maximumDate = maximumDate;
        this.scheduleState = scheduleState;
        this.finalizedDate = finalizedDate;
        this.verifiedUsers = verifiedUsers;
    }

    public static MeetScheduleDto from(MeetSchedule meetSchedule) {
        return MeetScheduleDto.builder()
                .id(meetSchedule.getId())
                .durationMinutes(meetSchedule.getDurationMinutes())
                .minimumDate(meetSchedule.getMinimumDate())
                .maximumDate(meetSchedule.getMaximumDate())
                .scheduleState(meetSchedule.getScheduleState())
                .finalizedDate(meetSchedule.getFinalizedDate())
                .verifiedUsers(meetSchedule.getVerifiedUsers())
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
        MeetScheduleDto that = (MeetScheduleDto) o;
        return id == that.id && Objects.equals(durationMinutes, that.durationMinutes) && Objects
                .equals(minimumDate, that.minimumDate) && Objects.equals(maximumDate, that.maximumDate)
                && scheduleState == that.scheduleState && Objects.equals(finalizedDate, that.finalizedDate)
                && Objects.equals(verifiedUsers, that.verifiedUsers);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, durationMinutes, minimumDate, maximumDate, scheduleState, finalizedDate, verifiedUsers);
    }
}
