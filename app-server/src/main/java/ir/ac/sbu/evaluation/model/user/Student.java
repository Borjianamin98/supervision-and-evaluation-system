package ir.ac.sbu.evaluation.model.user;

import javax.persistence.Entity;
import javax.persistence.Table;
import lombok.Builder;

@Entity
@Table(name = "student")
public class Student extends User {

    public Student() {
    }

    @Builder(builderMethodName = "studentBuilder")
    public Student(Long id, String username, String password) {
        super(id, username, password);
    }

}
