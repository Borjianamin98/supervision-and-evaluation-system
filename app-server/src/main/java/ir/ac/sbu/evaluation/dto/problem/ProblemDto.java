package ir.ac.sbu.evaluation.dto.problem;

import ir.ac.sbu.evaluation.dto.review.ProblemReviewDto;
import ir.ac.sbu.evaluation.dto.schedule.MeetScheduleDto;
import ir.ac.sbu.evaluation.dto.user.master.MasterDto;
import ir.ac.sbu.evaluation.dto.user.student.StudentDto;
import ir.ac.sbu.evaluation.enumeration.Education;
import ir.ac.sbu.evaluation.model.problem.Problem;
import ir.ac.sbu.evaluation.model.problem.ProblemState;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProblemDto {

    private long id;
    private Education education;
    private String title;
    private String englishTitle;
    private Set<String> keywords;
    private String definition;
    private String history;
    private String considerations;
    private ProblemState state;
    private double finalGrade;

    private StudentDto student;
    private MasterDto supervisor;
    private Set<MasterDto> referees;

    private MeetScheduleDto meetSchedule;
    private Set<ProblemReviewDto> problemReviews;

    @Builder
    public ProblemDto(long id,
            Education education,
            String title, String englishTitle, Set<String> keywords,
            String definition, String history, String considerations,
            ProblemState state,
            double finalGrade,
            StudentDto student,
            MasterDto supervisor,
            Set<MasterDto> referees,
            MeetScheduleDto meetSchedule,
            Set<ProblemReviewDto> problemReviews) {
        this.id = id;
        this.education = education;
        this.title = title;
        this.englishTitle = englishTitle;
        this.keywords = keywords;
        this.definition = definition;
        this.history = history;
        this.considerations = considerations;
        this.state = state;
        this.finalGrade = finalGrade;
        this.student = student;
        this.supervisor = supervisor;
        this.referees = referees;
        this.meetSchedule = meetSchedule;
        this.problemReviews = problemReviews;
    }

    public static ProblemDto from(Problem problem) {
        return ir.ac.sbu.evaluation.dto.problem.ProblemDto.builder()
                .id(problem.getId())
                .education(problem.getEducation())
                .title(problem.getTitle()).englishTitle(problem.getEnglishTitle())
                .keywords(problem.getKeywords())
                .definition(problem.getDefinition()).history(problem.getHistory())
                .considerations(problem.getConsiderations())
                .state(problem.getState())
                .finalGrade(problem.getFinalGrade())
                .student(StudentDto.from(problem.getStudent()))
                .supervisor(MasterDto.from(problem.getSupervisor()))
                .referees(problem.getReferees().stream().map(MasterDto::from).collect(Collectors.toSet()))
                .meetSchedule(MeetScheduleDto.from(problem.getMeetSchedule()))
                .problemReviews(
                        problem.getProblemReviews().stream().map(ProblemReviewDto::from).collect(Collectors.toSet()))
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
                && state == that.state
                && Double.compare(finalGrade, that.finalGrade) == 0;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, education,
                title, englishTitle, keywords,
                definition, history, considerations,
                state, finalGrade);
    }
}
