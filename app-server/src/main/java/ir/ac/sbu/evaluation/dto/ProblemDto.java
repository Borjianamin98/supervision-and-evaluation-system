package ir.ac.sbu.evaluation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import ir.ac.sbu.evaluation.enumeration.Education;
import java.util.Set;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.Builder;

public class ProblemDto {

    @NotNull
    private Education education;

    @NotBlank
    private String title;

    @NotBlank
    @JsonProperty("english_title")
    private String englishTitle;

    @NotNull
    private Set<String> keywords;

    @NotBlank
    private String definition;

    @NotNull
    private String history;

    @NotNull
    private String considerations;

    public ProblemDto() {
    }

    @Builder
    public ProblemDto(Education education, String title, String englishTitle, Set<String> keywords,
            String definition, String history, String considerations) {
        this.education = education;
        this.title = title;
        this.englishTitle = englishTitle;
        this.keywords = keywords;
        this.definition = definition;
        this.history = history;
        this.considerations = considerations;
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
}
