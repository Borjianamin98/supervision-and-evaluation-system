package ir.ac.sbu.evaluation.model.user;

import ir.ac.sbu.evaluation.model.problem.Problem;
import ir.ac.sbu.evaluation.model.university.Faculty;
import ir.ac.sbu.evaluation.security.SecurityRoles;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "master")
public class Master extends User {

    @Column(name = "degree")
    private String degree;

    @OneToMany(mappedBy = "supervisor")
    private Set<Problem> problemsSupervisor = new HashSet<>();

    @ManyToMany(mappedBy = "referees")
    private Set<Problem> problemsReferee = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "faculty_id")
    private Faculty faculty;

    public Master() {
    }

    @Builder
    public Master(Long id, String firstName, String lastName, String username, String password,
            PersonalInfo personalInfo, Byte[] profilePicture, String degree,
            Set<Problem> problemsSupervisor, Set<Problem> problemsReferee,
            Faculty faculty) {
        super(id, firstName, lastName, username, password, SecurityRoles.MASTER_ROLE_NAME, personalInfo,
                profilePicture);
        this.degree = degree;
        this.problemsSupervisor = problemsSupervisor == null ? new HashSet<>() : problemsSupervisor;
        this.problemsReferee = problemsReferee == null ? new HashSet<>() : problemsReferee;
        this.faculty = faculty;
    }
}
