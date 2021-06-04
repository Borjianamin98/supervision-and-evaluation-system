package ir.ac.sbu.evaluation.dto.schedule.event;

import java.time.Instant;
import javax.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DateRangeDto {

    @NotNull
    private Instant startDate;

    @NotNull
    private Instant endDate;

    public DateRangeDto() {
    }

    @Builder
    public DateRangeDto(Instant startDate, Instant endDate) {
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
