package ir.ac.sbu.evaluation.model.user;

import ir.ac.sbu.evaluation.model.Problem;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import lombok.Builder;

@Entity
@Table(name = "student")
public class Student extends User {

    @Column(name = "student_number")
    private String studentNumber;

    @OneToMany(mappedBy = "student")
    private Set<Problem> problems;

    public Student() {
    }

    @Builder
    public Student(Long id, String firstName, String lastName, String username, String password, String role,
            PersonalInfo personalInfo, Byte[] profilePicture, String studentNumber,
            Set<Problem> problems) {
        super(id, firstName, lastName, username, password, role, personalInfo, profilePicture);
        this.studentNumber = studentNumber;
        this.problems = problems;
    }

    public String getStudentNumber() {
        return studentNumber;
    }

    public void setStudentNumber(String studentNumber) {
        this.studentNumber = studentNumber;
    }

    public Set<Problem> getProblems() {
        return problems;
    }

    public void setProblems(Set<Problem> problems) {
        this.problems = problems;
    }
}
