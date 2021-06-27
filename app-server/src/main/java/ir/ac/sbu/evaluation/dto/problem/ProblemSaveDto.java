package ir.ac.sbu.evaluation.dto.problem;

import ir.ac.sbu.evaluation.enumeration.Education;
import ir.ac.sbu.evaluation.model.problem.Problem;
import java.util.Objects;
import java.util.Set;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProblemSaveDto {

    @NotNull
    private Education education;

    @NotBlank
    @Size(max = 70)
    private String title;

    @NotBlank
    @Size(max = 70)
    private String englishTitle;

    @NotNull
    @Size(min = 2, max = 5)
    private Set<@Size(min = 2) String> keywords;

    @NotBlank
    @Size(max = 1000)
    private String definition;

    @NotNull
    @Size(max = 1000)
    private String history;

    @NotBlank
    @Size(max = 1000)
    private String considerations;

    @Min(1)
    private long supervisorId;

    @Min(1)
    @Max(5)
    private int numberOfReferees;

    public ProblemSaveDto() {
    }

    @Builder
    public ProblemSaveDto(Education education,
            String title,
            String englishTitle,
            Set<String> keywords,
            String definition,
            String history,
            String considerations,
            long supervisorId,
            int numberOfReferees) {
        this.education = education;
        this.title = title;
        this.englishTitle = englishTitle;
        this.keywords = keywords;
        this.definition = definition;
        this.history = history;
        this.considerations = considerations;
        this.supervisorId = supervisorId;
        this.numberOfReferees = numberOfReferees;
    }

    public Problem toProblem() {
        return Problem.builder()
                .education(education)
                .title(title).englishTitle(englishTitle)
                .keywords(keywords)
                .definition(definition).history(history)
                .considerations(considerations)
                .numberOfReferees(numberOfReferees)
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
        ProblemSaveDto that = (ProblemSaveDto) o;
        return education == that.education
                && Objects.equals(title, that.title)
                && Objects.equals(englishTitle, that.englishTitle)
                && Objects.equals(keywords, that.keywords)
                && Objects.equals(definition, that.definition)
                && Objects.equals(history, that.history)
                && Objects.equals(considerations, that.considerations)
                && Objects.equals(supervisorId, that.supervisorId)
                && Objects.equals(numberOfReferees, that.numberOfReferees);
    }

    @Override
    public int hashCode() {
        return Objects.hash(education,
                title,
                englishTitle,
                keywords,
                definition,
                history,
                considerations,
                supervisorId,
                numberOfReferees);
    }
}
