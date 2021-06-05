package ir.ac.sbu.evaluation.dto.schedule;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import ir.ac.sbu.evaluation.model.schedule.MeetSchedule;
import java.util.Objects;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MeetScheduleDto {

    @JsonProperty(access = Access.READ_ONLY)
    private long id;

    public MeetScheduleDto() {
    }

    @Builder
    public MeetScheduleDto(long id) {
        this.id = id;
    }

    public static MeetScheduleDto from(MeetSchedule schedule) {
        return MeetScheduleDto.builder()
                .id(schedule.getId())
                .build();
    }

    public MeetSchedule toMeetSchedule() {
        return MeetSchedule.builder()
                .id(id)
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
        return id == that.id;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
