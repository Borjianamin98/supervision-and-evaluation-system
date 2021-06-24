package ir.ac.sbu.evaluation.model.review;

import java.util.Objects;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ScoreCount {

    private int score;
    private long count;

    @Builder
    public ScoreCount(int score, long count) {
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
        ScoreCount that = (ScoreCount) o;
        return score == that.score && count == that.count;
    }

    @Override
    public int hashCode() {
        return Objects.hash(score, count);
    }
}