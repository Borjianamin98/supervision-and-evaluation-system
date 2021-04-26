package ir.ac.sbu.evaluation.dto.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import ir.ac.sbu.evaluation.enumeration.Gender;
import ir.ac.sbu.evaluation.model.user.PersonalInfo;
import javax.validation.constraints.NotBlank;
import lombok.Builder;

public class PersonalInfoDto {

    @JsonProperty(access = Access.READ_ONLY)
    private long id;

    @NotBlank
    private Gender gender;

    @NotBlank
    private String telephoneNumber;

    @NotBlank
    private String email;

    public PersonalInfoDto() {
    }

    @Builder
    public PersonalInfoDto(long id, Gender gender, String telephoneNumber, String email) {
        this.id = id;
        this.gender = gender;
        this.telephoneNumber = telephoneNumber;
        this.email = email;
    }

    public static PersonalInfoDto from(PersonalInfo personalInfo) {
        return builder()
                .id(personalInfo.getId())
                .gender(personalInfo.getGender())
                .telephoneNumber(personalInfo.getTelephoneNumber())
                .email(personalInfo.getEmail())
                .build();
    }

    public PersonalInfo toPersonalInfo() {
        return PersonalInfo.builder()
                .id(id)
                .gender(gender)
                .telephoneNumber(telephoneNumber)
                .email(email)
                .build();
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
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
