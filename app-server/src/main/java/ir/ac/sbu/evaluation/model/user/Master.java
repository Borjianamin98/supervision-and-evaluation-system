package ir.ac.sbu.evaluation.model.user;

import ir.ac.sbu.evaluation.model.Problem;
import java.util.Set;
import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import lombok.Builder;

@Entity
@Table(name = "master")
public class Master extends User {

    @OneToMany(mappedBy = "supervisor")
    private Set<Problem> problemsSupervisor;

    @ManyToMany(mappedBy = "referees")
    private Set<Problem> problemsReferee;

    public Master() {
    }

    @Builder
    public Master(Long id, String username, String password,
            Set<Problem> problemsSupervisor, Set<Problem> problemsReferee) {
        super(id, username, password);
        this.problemsSupervisor = problemsSupervisor;
        this.problemsReferee = problemsReferee;
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
