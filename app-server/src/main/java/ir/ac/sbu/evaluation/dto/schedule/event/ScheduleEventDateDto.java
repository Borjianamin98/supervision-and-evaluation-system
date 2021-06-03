package ir.ac.sbu.evaluation.dto.schedule.event;

import java.time.Instant;
import javax.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ScheduleEventDateDto {

    @NotNull
    private Instant startDate;

    @NotNull
    private Instant endDate;

    public ScheduleEventDateDto() {
    }

    @Builder
    public ScheduleEventDateDto(Instant startDate, Instant endDate) {
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
