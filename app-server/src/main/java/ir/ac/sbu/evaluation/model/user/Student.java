package ir.ac.sbu.evaluation.model.user;

import ir.ac.sbu.evaluation.model.Problem;
import java.util.Set;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import lombok.Builder;

@Entity
@Table(name = "student")
public class Student extends User {

    @OneToMany(mappedBy = "student")
    private Set<Problem> problems;

    public Student() {
    }

    @Builder
    public Student(Long id, String username, String password, Set<Problem> problems) {
        super(id, username, password);
        this.problems = problems;
    }

    public Set<Problem> getProblems() {
        return problems;
    }

    public void setProblems(Set<Problem> problems) {
        this.problems = problems;
    }
}
