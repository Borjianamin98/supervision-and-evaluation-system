package ir.ac.sbu.evaluation.model.university;

import ir.ac.sbu.evaluation.model.BaseEntity;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import lombok.Builder;

@Entity
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

    public String getWebAddress() {
        return webAddress;
    }

    public void setWebAddress(String webAddress) {
        this.webAddress = webAddress;
    }

    public List<Faculty> getFaculties() {
        return faculties;
    }

    public void setFaculties(List<Faculty> faculties) {
        this.faculties = faculties;
    }
}
