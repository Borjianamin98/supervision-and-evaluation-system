package ir.ac.sbu.evaluation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import ir.ac.sbu.evaluation.enumeration.Education;
import ir.ac.sbu.evaluation.enumeration.ProblemState;
import ir.ac.sbu.evaluation.model.Problem;
import java.util.Set;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import lombok.Builder;

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
    @Size(max = 400)
    private String definition;

    @NotNull
    @Size(max = 400)
    private String history;

    @NotBlank
    @Size(max = 400)
    private String considerations;

    @JsonProperty(access = Access.READ_ONLY)
    private ProblemState state;

    @NotNull
    private UserDto supervisor;

    public ProblemDto() {
    }

    @Builder
    public ProblemDto(long id, Education education, String title, String englishTitle, Set<String> keywords,
            String definition, String history, String considerations, ProblemState state,
            UserDto supervisor) {
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

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Education getEducation() {
        return education;
    }

    public void setEducation(Education education) {
        this.education = education;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getEnglishTitle() {
        return englishTitle;
    }

    public void setEnglishTitle(String englishTitle) {
        this.englishTitle = englishTitle;
    }

    public Set<String> getKeywords() {
        return keywords;
    }

    public void setKeywords(Set<String> keywords) {
        this.keywords = keywords;
    }

    public String getDefinition() {
        return definition;
    }

    public void setDefinition(String definition) {
        this.definition = definition;
    }

    public String getHistory() {
        return history;
    }

    public void setHistory(String history) {
        this.history = history;
    }

    public String getConsiderations() {
        return considerations;
    }

    public void setConsiderations(String considerations) {
        this.considerations = considerations;
    }

    public ProblemState getState() {
        return state;
    }

    public void setState(ProblemState state) {
        this.state = state;
    }

    public UserDto getSupervisor() {
        return supervisor;
    }

    public void setSupervisor(UserDto supervisor) {
        this.supervisor = supervisor;
    }
}
