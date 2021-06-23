package ir.ac.sbu.evaluation.dto.schedule;

import ir.ac.sbu.evaluation.model.schedule.MeetSchedule;
import java.time.Instant;
import java.util.Objects;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MeetScheduleSaveDto {

    @Min(value = 0)
    @Max(value = 120)
    private long durationMinutes;

    @NotNull
    private Instant minimumDate;

    @NotNull
    private Instant maximumDate;

    private Instant finalizedDate;

    public MeetScheduleSaveDto() {
    }

    @Builder
    public MeetScheduleSaveDto(long durationMinutes, Instant minimumDate, Instant maximumDate,
            Instant finalizedDate) {
        this.durationMinutes = durationMinutes;
        this.minimumDate = minimumDate;
        this.maximumDate = maximumDate;
        this.finalizedDate = finalizedDate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        MeetScheduleSaveDto that = (MeetScheduleSaveDto) o;
        return Objects.equals(durationMinutes, that.durationMinutes) && Objects
                .equals(minimumDate, that.minimumDate) && Objects.equals(maximumDate, that.maximumDate)
                && Objects.equals(finalizedDate, that.finalizedDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(durationMinutes, minimumDate, maximumDate, finalizedDate);
    }
}
