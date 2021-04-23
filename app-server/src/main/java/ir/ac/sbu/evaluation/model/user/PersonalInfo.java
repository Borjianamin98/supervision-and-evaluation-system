package ir.ac.sbu.evaluation.model.user;

import ir.ac.sbu.evaluation.model.BaseEntity;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import lombok.Builder;

@Entity
@Table(name = "personal_info")
public class PersonalInfo extends BaseEntity {

    @Column(name = "telephone_number")
    private String telephoneNumber;

    @Column(name = "email")
    private String email;

    public PersonalInfo() {
    }

    @Builder
    public PersonalInfo(Long id, String telephoneNumber, String email) {
        super(id);
        this.telephoneNumber = telephoneNumber;
        this.email = email;
    }

    public String getTelephoneNumber() {
        return telephoneNumber;
    }

    public void setTelephoneNumber(String telephoneNumber) {
        this.telephoneNumber = telephoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
