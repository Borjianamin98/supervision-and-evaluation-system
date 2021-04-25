package ir.ac.sbu.evaluation.model.user;

import ir.ac.sbu.evaluation.enumeration.Gender;
import ir.ac.sbu.evaluation.model.BaseEntity;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;
import lombok.Builder;

@Entity
@Table(name = "personal_info")
public class PersonalInfo extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @Column(name = "telephone_number")
    private String telephoneNumber;

    @Column(name = "email")
    private String email;

    public PersonalInfo() {
    }

    @Builder
    public PersonalInfo(Long id, Gender gender, String telephoneNumber, String email) {
        super(id);
        this.gender = gender;
        this.telephoneNumber = telephoneNumber;
        this.email = email;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
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
