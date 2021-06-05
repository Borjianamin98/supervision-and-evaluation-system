package ir.ac.sbu.evaluation.dto.schedule.event;

import java.time.Instant;
import java.util.Objects;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        DateRangeDto that = (DateRangeDto) o;
        return Objects.equals(startDate, that.startDate) && Objects.equals(endDate, that.endDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(startDate, endDate);
    }
}
