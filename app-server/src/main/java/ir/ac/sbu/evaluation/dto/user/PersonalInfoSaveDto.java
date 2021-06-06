package ir.ac.sbu.evaluation.dto.user;

import ir.ac.sbu.evaluation.enumeration.Gender;
import ir.ac.sbu.evaluation.model.user.PersonalInfo;
import java.util.Objects;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PersonalInfoSaveDto {

    private final static String EMAIL_REGEX_PATTERN = "^(([^<>()\\[\\]\\\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$";

    @NotNull
    private Gender gender;

    @NotBlank
    @Pattern(regexp = "[0-9]{10}")
    private String telephoneNumber;

    @NotBlank
    @Pattern(regexp = EMAIL_REGEX_PATTERN)
    private String email;

    public PersonalInfoSaveDto() {
    }

    @Builder
    public PersonalInfoSaveDto(Gender gender, String telephoneNumber, String email) {
        this.gender = gender;
        this.telephoneNumber = telephoneNumber;
        this.email = email;
    }

    public static PersonalInfoSaveDto from(PersonalInfo personalInfo) {
        return builder()
                .gender(personalInfo.getGender())
                .telephoneNumber(personalInfo.getTelephoneNumber())
                .email(personalInfo.getEmail())
                .build();
    }

    public PersonalInfo toPersonalInfo() {
        return PersonalInfo.builder()
                .gender(gender)
                .telephoneNumber(telephoneNumber)
                .email(email)
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
        PersonalInfoSaveDto that = (PersonalInfoSaveDto) o;
        return gender == that.gender
                && Objects.equals(telephoneNumber, that.telephoneNumber)
                && Objects.equals(email, that.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(gender, telephoneNumber, email);
    }
}
