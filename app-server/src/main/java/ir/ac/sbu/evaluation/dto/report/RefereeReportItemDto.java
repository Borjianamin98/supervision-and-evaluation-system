package ir.ac.sbu.evaluation.dto.report;

import java.util.Objects;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RefereeReportItemDto {

    private String universityName;
    private long totalProblems;
    private long supervisorCount;
    private long refereeCount;

    public RefereeReportItemDto(String universityName,
            long totalProblems,
            long supervisorCount,
            long refereeCount) {
        this.universityName = universityName;
        this.totalProblems = totalProblems;
        this.supervisorCount = supervisorCount;
        this.refereeCount = refereeCount;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        RefereeReportItemDto that = (RefereeReportItemDto) o;
        return Objects.equals(universityName, that.universityName)
                && supervisorCount == that.supervisorCount
                && refereeCount == that.refereeCount
                && totalProblems == that.totalProblems;
    }

    @Override
    public int hashCode() {
        return Objects.hash(universityName, totalProblems, supervisorCount, refereeCount);
    }
}