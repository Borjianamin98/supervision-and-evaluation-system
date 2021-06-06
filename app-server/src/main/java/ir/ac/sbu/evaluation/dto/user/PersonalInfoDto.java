package ir.ac.sbu.evaluation.dto.user;

import ir.ac.sbu.evaluation.enumeration.Gender;
import ir.ac.sbu.evaluation.model.user.PersonalInfo;
import java.util.Objects;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PersonalInfoDto {

    private long id;
    private Gender gender;
    private String telephoneNumber;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        PersonalInfoDto that = (PersonalInfoDto) o;
        return id == that.id
                && gender == that.gender
                && Objects.equals(telephoneNumber, that.telephoneNumber)
                && Objects.equals(email, that.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, gender, telephoneNumber, email);
    }
}
