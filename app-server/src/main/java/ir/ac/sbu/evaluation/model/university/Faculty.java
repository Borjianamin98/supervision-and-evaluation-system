package ir.ac.sbu.evaluation.model.university;

import ir.ac.sbu.evaluation.model.BaseEntity;
import ir.ac.sbu.evaluation.model.user.Master;
import ir.ac.sbu.evaluation.model.user.Student;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "faculty")
public class Faculty extends BaseEntity {

    @Column(name = "name")
    private String name;

    @Column(name = "web_address")
    private String webAddress;

    @ManyToOne
    @JoinColumn(name = "university_id")
    private University university;

    @OneToMany(mappedBy = "faculty")
    private Set<Student> students = new HashSet<>();

    @OneToMany(mappedBy = "faculty")
    private Set<Master> masters = new HashSet<>();;

    public Faculty() {
    }

    @Builder
    public Faculty(Long id, String name, String webAddress, University university,
            Set<Student> students, Set<Master> masters) {
        super(id);
        this.name = name;
        this.webAddress = webAddress;
        this.university = university;
        this.students = students != null ? students : new HashSet<>();
        this.masters = masters != null ? masters : new HashSet<>();;
    }
}
