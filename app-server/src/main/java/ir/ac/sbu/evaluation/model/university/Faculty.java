package ir.ac.sbu.evaluation.model.university;

import ir.ac.sbu.evaluation.model.BaseEntity;
import ir.ac.sbu.evaluation.model.user.Student;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.Builder;

@Entity
@Table(name = "faculty")
public class Faculty extends BaseEntity {

    @Column(name = "name")
    private String name;

    @Column(name = "location")
    private String location;

    @ManyToOne
    @JoinColumn(name = "university_id")
    private University university;

    public Faculty() {
    }

    @Builder
    public Faculty(Long id, String name, String location, University university) {
        super(id);
        this.name = name;
        this.location = location;
        this.university = university;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public University getUniversity() {
        return university;
    }

    public void setUniversity(University university) {
        this.university = university;
    }
}
