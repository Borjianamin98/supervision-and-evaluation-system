package ir.ac.sbu.evaluation.model.user;

import ir.ac.sbu.evaluation.model.problem.Problem;
import ir.ac.sbu.evaluation.model.university.Faculty;
import ir.ac.sbu.evaluation.security.SecurityRoles;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import lombok.Builder;

@Entity
@Table(name = "student")
public class Student extends User {

    @Column(name = "student_number")
    private String studentNumber;

    @ManyToOne
    @JoinColumn(name = "faculty_id")
    private Faculty faculty;

    @OneToMany(mappedBy = "student")
    private Set<Problem> problems;

    public Student() {
    }

    @Builder
    public Student(Long id, String firstName, String lastName, String username, String password,
            PersonalInfo personalInfo, Byte[] profilePicture, String studentNumber,
            Set<Problem> problems, Faculty faculty) {
        super(id, firstName, lastName, username, password, SecurityRoles.STUDENT_ROLE_NAME, personalInfo,
                profilePicture);
        this.studentNumber = studentNumber;
        this.problems = problems;
        this.faculty = faculty;
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

    public Faculty getFaculty() {
        return faculty;
    }

    public void setFaculty(Faculty faculty) {
        this.faculty = faculty;
    }
}
