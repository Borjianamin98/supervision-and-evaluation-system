package ir.ac.sbu.evaluation.dto.report;

import java.util.Objects;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ScoreCountDto {

    private int score;
    private long count;

    @Builder
    public ScoreCountDto(int score, long count) {
        this.score = score;
        this.count = count;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        ScoreCountDto that = (ScoreCountDto) o;
        return score == that.score && count == that.count;
    }

    @Override
    public int hashCode() {
        return Objects.hash(score, count);
    }
}