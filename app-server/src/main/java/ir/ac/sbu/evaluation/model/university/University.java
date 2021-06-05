package ir.ac.sbu.evaluation.model.university;

import ir.ac.sbu.evaluation.model.BaseEntity;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "university")
public class University extends BaseEntity {

    @Column(name = "name")
    private String name;

    @Column(name = "location")
    private String location;

    @Column(name = "web_address")
    private String webAddress;

    @OneToMany(mappedBy = "university")
    private List<Faculty> faculties = new ArrayList<>();

    public University() {
    }

    @Builder
    public University(Long id, String name, String location, String webAddress,
            List<Faculty> faculties) {
        super(id);
        this.name = name;
        this.location = location;
        this.webAddress = webAddress;
        this.faculties = faculties != null ? faculties : new ArrayList<>();
    }
}
