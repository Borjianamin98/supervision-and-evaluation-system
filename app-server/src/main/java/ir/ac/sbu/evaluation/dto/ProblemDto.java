package ir.ac.sbu.evaluation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import ir.ac.sbu.evaluation.dto.user.UserDto;
import ir.ac.sbu.evaluation.enumeration.Education;
import ir.ac.sbu.evaluation.enumeration.ProblemState;
import ir.ac.sbu.evaluation.model.problem.ProblemEvent;
import ir.ac.sbu.evaluation.model.problem.Problem;
import java.util.Set;
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
    private Set<ProblemEvent> events;

    @JsonProperty(access = Access.READ_ONLY)
    private ProblemState state;

    @NotNull
    private UserDto supervisor;

    public ProblemDto() {
    }

    @Builder
    public ProblemDto(long id, Education education, String title, String englishTitle, Set<String> keywords,
            String definition, String history, String considerations, ProblemState state,
            UserDto supervisor, Set<ProblemEvent> events) {
        this.id = id;
        this.education = education;
        this.title = title;
        this.englishTitle = englishTitle;
        this.keywords = keywords;
        this.definition = definition;
        this.history = history;
        this.considerations = considerations;
        this.state = state;
        this.supervisor = supervisor;
        this.events = events;
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
                .supervisor(UserDto.from(problem.getSupervisor()))
                .events(problem.getEvents())
                .build();
    }

    public Problem toProblem() {
        // Ignore below fields (they should injected separately):
        //   + supervisor
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
}
