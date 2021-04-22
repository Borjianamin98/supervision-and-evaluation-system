package ir.ac.sbu.evaluation.model;

import ir.ac.sbu.evaluation.enumeration.Education;
import ir.ac.sbu.evaluation.enumeration.ProblemState;
import ir.ac.sbu.evaluation.model.user.Master;
import ir.ac.sbu.evaluation.model.user.Student;
import java.util.Set;
import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.Builder;

@Entity
@Table(name = "problem")
public class Problem extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "education")
    private Education education;

    @Column(name = "title")
    private String title;

    @Column(name = "english_title")
    private String englishTitle;

    @Column(name = "keyword")
    @ElementCollection
    @CollectionTable(name = "problem_keyword", joinColumns = @JoinColumn(name = "problem_id"))
    private Set<String> keywords;

    @Column(name = "definition")
    private String definition;

    @Column(name = "history")
    private String history;

    @Column(name = "considerations")
    private String considerations;

    @Enumerated(EnumType.STRING)
    @Column(name = "state")
    private ProblemState state;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "supervisor_id")
    private Master supervisor;

    @ManyToMany
    @JoinTable(name = "problems_referees",
            joinColumns = @JoinColumn(name = "problem_id"),
            inverseJoinColumns = @JoinColumn(name = "referee_id"))
    private Set<Master> referees;

    public Problem() {
    }

    @Builder
    public Problem(Long id, Education education, String title, String englishTitle,
            Set<String> keywords, String definition, String history, String considerations,
            ProblemState state, Student student, Master supervisor,
            Set<Master> referees) {
        super(id);
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

    public void setState(ProblemState generalState) {
        this.state = generalState;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Master getSupervisor() {
        return supervisor;
    }

    public void setSupervisor(Master supervisor) {
        this.supervisor = supervisor;
    }

    public Set<Master> getReferees() {
        return referees;
    }

    public void setReferees(Set<Master> referees) {
        this.referees = referees;
    }
}
