package ir.ac.sbu.evaluation.dto.schedule.event;

import java.time.Instant;
import javax.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ScheduleEventCreateDto {

    @NotNull
    private Instant startDate;

    @NotNull
    private Instant endDate;

    public ScheduleEventCreateDto() {
    }

    @Builder
    public ScheduleEventCreateDto(Instant startDate, Instant endDate) {
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
