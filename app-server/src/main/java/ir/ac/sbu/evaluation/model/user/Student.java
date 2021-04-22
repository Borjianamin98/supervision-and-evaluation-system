package ir.ac.sbu.evaluation.model.user;

import ir.ac.sbu.evaluation.model.Problem;
import ir.ac.sbu.evaluation.security.SecurityRoles;
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
    public Student(Long id, String firstName, String lastName, String username, String password, String role,
            Byte[] profilePicture, Set<Problem> problems) {
        super(id, firstName, lastName, username, password, SecurityRoles.STUDENT_ROLE_NAME, profilePicture);
        this.problems = problems;
    }

    public Set<Problem> getProblems() {
        return problems;
    }

    public void setProblems(Set<Problem> problems) {
        this.problems = problems;
    }
}
