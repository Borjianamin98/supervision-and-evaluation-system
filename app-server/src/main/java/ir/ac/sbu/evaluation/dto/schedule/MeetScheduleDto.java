package ir.ac.sbu.evaluation.dto.schedule;

import ir.ac.sbu.evaluation.model.schedule.MeetSchedule;
import java.util.Objects;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MeetScheduleDto {

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
