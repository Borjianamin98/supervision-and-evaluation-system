package ir.ac.sbu.evaluation.dto.schedule;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import ir.ac.sbu.evaluation.model.schedule.MeetSchedule;
import ir.ac.sbu.evaluation.model.schedule.MeetScheduleState;
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
    private MeetScheduleState state;
    private Instant finalizedDate;
    private boolean meetingHeld;

    private Set<Long> announcedUsers;

    public MeetScheduleDto() {
    }

    @Builder
    public MeetScheduleDto(long id,
            long durationMinutes,
            Instant minimumDate,
            Instant maximumDate,
            MeetScheduleState state,
            Instant finalizedDate,
            boolean meetingHeld,
            Set<Long> announcedUsers) {
        this.id = id;
        this.durationMinutes = durationMinutes;
        this.minimumDate = minimumDate;
        this.maximumDate = maximumDate;
        this.state = state;
        this.finalizedDate = finalizedDate;
        this.meetingHeld = meetingHeld;
        this.announcedUsers = announcedUsers;
    }

    public static MeetScheduleDto from(MeetSchedule meetSchedule) {
        return MeetScheduleDto.builder()
                .id(meetSchedule.getId())
                .durationMinutes(meetSchedule.getDurationMinutes())
                .minimumDate(meetSchedule.getMinimumDate())
                .maximumDate(meetSchedule.getMaximumDate())
                .state(meetSchedule.getState())
                .finalizedDate(meetSchedule.getFinalizedDate())
                .meetingHeld(meetSchedule.getMeetingHeld())
                .announcedUsers(meetSchedule.getAnnouncedUsers())
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
        return id == that.id
                && durationMinutes == that.durationMinutes
                && Objects.equals(minimumDate, that.minimumDate)
                && Objects.equals(maximumDate, that.maximumDate)
                && state == that.state
                && Objects.equals(finalizedDate, that.finalizedDate)
                && meetingHeld == that.meetingHeld
                && Objects.equals(announcedUsers, that.announcedUsers);
    }

    @Override
    public int hashCode() {
        return Objects
                .hash(id, durationMinutes, minimumDate, maximumDate, state, finalizedDate, meetingHeld, announcedUsers);
    }
}
