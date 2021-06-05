package ir.ac.sbu.evaluation.dto.problem;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import ir.ac.sbu.evaluation.dto.schedule.MeetScheduleDto;
import ir.ac.sbu.evaluation.dto.user.master.MasterDto;
import ir.ac.sbu.evaluation.dto.user.student.StudentDto;
import ir.ac.sbu.evaluation.enumeration.Education;
import ir.ac.sbu.evaluation.enumeration.ProblemState;
import ir.ac.sbu.evaluation.model.problem.Problem;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProblemDto {

    @JsonProperty(access = Access.READ_ONLY)
    private long id;

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

    @JsonProperty(access = Access.READ_ONLY)
    private ProblemState state;

    @NotNull
    private StudentDto student;

    @NotNull
    private MasterDto supervisor;

    @NotNull
    private Set<MasterDto> referees;

    @NotNull
    private MeetScheduleDto meetSchedule;

    public ProblemDto() {
    }

    @Builder
    public ProblemDto(long id,
            Education education,
            String title, String englishTitle, Set<String> keywords,
            String definition, String history, String considerations,
            ProblemState state,
            StudentDto student, MasterDto supervisor, Set<MasterDto> referees,
            MeetScheduleDto meetSchedule) {
        this.id = id;
        this.education = education;
        this.title = title;
        this.englishTitle = englishTitle;
        this.keywords = keywords;
        this.definition = definition;
        this.history = history;
        this.considerations = considerations;
        this.state = state;
        this.student = student;
        this.supervisor = supervisor;
        this.referees = referees;
        this.meetSchedule = meetSchedule;
    }

    public static ProblemDto from(Problem problem) {
        return ProblemDto.builder()
                .id(problem.getId())
                .education(problem.getEducation())
                .title(problem.getTitle()).englishTitle(problem.getEnglishTitle())
                .keywords(problem.getKeywords())
                .definition(problem.getDefinition()).history(problem.getHistory())
                .considerations(problem.getConsiderations())
                .state(problem.getState())
                .student(StudentDto.from(problem.getStudent()))
                .supervisor(MasterDto.from(problem.getSupervisor()))
                .referees(problem.getReferees().stream().map(MasterDto::from).collect(Collectors.toSet()))
                .meetSchedule(MeetScheduleDto.from(problem.getMeetSchedule()))
                .build();
    }

    public Problem toProblem() {
        return Problem.builder()
                .id(id)
                .education(education)
                .title(title).englishTitle(englishTitle)
                .keywords(keywords)
                .definition(definition).history(history)
                .state(state)
                .considerations(considerations)
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
        ProblemDto that = (ProblemDto) o;
        return id == that.id
                && education == that.education
                && Objects.equals(title, that.title)
                && Objects.equals(englishTitle, that.englishTitle)
                && Objects.equals(keywords, that.keywords)
                && Objects.equals(definition, that.definition)
                && Objects.equals(history, that.history)
                && Objects.equals(considerations, that.considerations)
                && state == that.state;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, education, title, englishTitle, keywords, definition, history, considerations, state);
    }
}
