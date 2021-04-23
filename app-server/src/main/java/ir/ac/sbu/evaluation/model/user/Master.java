package ir.ac.sbu.evaluation.model.user;

import ir.ac.sbu.evaluation.model.Problem;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import lombok.Builder;

@Entity
@Table(name = "master")
public class Master extends User {

    @Column(name = "degree")
    private String degree;

    @OneToMany(mappedBy = "supervisor")
    private Set<Problem> problemsSupervisor;

    @ManyToMany(mappedBy = "referees")
    private Set<Problem> problemsReferee;

    public Master() {
    }

    @Builder
    public Master(Long id, String firstName, String lastName, String username, String password, String role,
            PersonalInfo personalInfo, Byte[] profilePicture, String degree,
            Set<Problem> problemsSupervisor, Set<Problem> problemsReferee) {
        super(id, firstName, lastName, username, password, role, personalInfo, profilePicture);
        this.degree = degree;
        this.problemsSupervisor = problemsSupervisor;
        this.problemsReferee = problemsReferee;
    }

    public String getDegree() {
        return degree;
    }

    public void setDegree(String degree) {
        this.degree = degree;
    }

    public Set<Problem> getProblemsSupervisor() {
        return problemsSupervisor;
    }

    public void setProblemsSupervisor(Set<Problem> problemsSupervisor) {
        this.problemsSupervisor = problemsSupervisor;
    }

    public Set<Problem> getProblemsReferee() {
        return problemsReferee;
    }

    public void setProblemsReferee(Set<Problem> problemsReferee) {
        this.problemsReferee = problemsReferee;
    }
}
