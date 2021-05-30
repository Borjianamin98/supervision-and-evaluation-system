package ir.ac.sbu.evaluation.dto.schedule;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import ir.ac.sbu.evaluation.model.schedule.MeetSchedule;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MeetScheduleDto {

    @JsonProperty(access = Access.READ_ONLY)
    private long id;

    @JsonProperty(access = Access.READ_ONLY)
    private Set<ScheduleEventDto> scheduleEvents;

    public MeetScheduleDto() {
    }

    @Builder
    public MeetScheduleDto(long id, Set<ScheduleEventDto> scheduleEvents) {
        this.id = id;
        this.scheduleEvents = scheduleEvents;
    }

    public static MeetScheduleDto from(MeetSchedule schedule) {
        return MeetScheduleDto.builder()
                .id(schedule.getId())
                .scheduleEvents(schedule.getScheduleEvents().stream()
                        .map(ScheduleEventDto::from).collect(Collectors.toSet()))
                .build();
    }

    public MeetSchedule toMeetSchedule() {
        return MeetSchedule.builder()
                .id(id)
                .scheduleEvents(scheduleEvents != null ? scheduleEvents.stream()
                        .map(ScheduleEventDto::toScheduleEvent).collect(Collectors.toSet()) : new HashSet<>())
                .build();
    }
}
