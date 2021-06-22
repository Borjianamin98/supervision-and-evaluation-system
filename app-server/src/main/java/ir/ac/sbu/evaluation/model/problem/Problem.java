package ir.ac.sbu.evaluation.model.problem;

import ir.ac.sbu.evaluation.enumeration.Education;
import ir.ac.sbu.evaluation.model.BaseEntity;
import ir.ac.sbu.evaluation.model.review.PeerReview;
import ir.ac.sbu.evaluation.model.review.ProblemReview;
import ir.ac.sbu.evaluation.model.schedule.MeetSchedule;
import ir.ac.sbu.evaluation.model.user.Master;
import ir.ac.sbu.evaluation.model.user.Student;
import java.util.HashSet;
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
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
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

    @Column(name = "definition", length = 1000)
    private String definition;

    @Column(name = "history", length = 1000)
    private String history;

    @Column(name = "considerations", length = 1000)
    private String considerations;

    @Enumerated(EnumType.STRING)
    @Column(name = "state")
    private ProblemState state;

    @Column(name = "final_grade")
    private Integer finalGrade = 0;

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

    @OneToMany(mappedBy = "problem")
    private Set<ProblemEvent> events = new HashSet<>();

    @OneToOne
    @JoinColumn(name = "schedule")
    private MeetSchedule meetSchedule;

    @OneToMany(mappedBy = "problem")
    private Set<PeerReview> peerReviews = new HashSet<>();

    @OneToMany(mappedBy = "problem")
    private Set<ProblemReview> problemReviews = new HashSet<>();

    public Problem() {
    }

    @Builder
    public Problem(Long id,
            Education education, String title, String englishTitle,
            Set<String> keywords, String definition, String history, String considerations,
            ProblemState state,
            Integer finalGrade,
            Student student,
            Master supervisor,
            Set<Master> referees,
            Set<ProblemEvent> events,
            MeetSchedule meetSchedule,
            Set<PeerReview> peerReviews,
            Set<ProblemReview> problemReviews) {
        super(id);
        this.education = education;
        this.title = title;
        this.englishTitle = englishTitle;
        this.keywords = keywords;
        this.definition = definition;
        this.history = history;
        this.considerations = considerations;
        this.state = state;
        this.finalGrade = finalGrade == null ? 0 : finalGrade;
        this.student = student;
        this.supervisor = supervisor;
        this.referees = referees == null ? new HashSet<>() : referees;
        this.events = events == null ? new HashSet<>() : events;
        this.meetSchedule = meetSchedule;
        this.peerReviews = peerReviews == null ? new HashSet<>() : peerReviews;
        this.problemReviews = problemReviews == null ? new HashSet<>() : problemReviews;
    }

    @Override
    public String toString() {
        return "Problem{" +
                "education=" + education +
                ", title='" + title + '\'' +
                ", englishTitle='" + englishTitle + '\'' +
                ", keywords=" + keywords +
                ", definition='" + definition + '\'' +
                ", history='" + history + '\'' +
                ", considerations='" + considerations + '\'' +
                ", state=" + state +
                ", finalGrade=" + finalGrade +
                '}';
    }
}
