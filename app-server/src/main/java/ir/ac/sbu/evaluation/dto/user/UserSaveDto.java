package ir.ac.sbu.evaluation.dto.user;

import ir.ac.sbu.evaluation.model.user.User;
import java.util.Objects;
import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserSaveDto {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotBlank
    private String username;

    @NotBlank
    @Size(min = 8)
    private String password;

    @NotNull
    @Valid
    private PersonalInfoSaveDto personalInfo;

    public UserSaveDto() {
    }

    @Builder(builderMethodName = "userBuilder")
    public UserSaveDto(String firstName, String lastName,
            String username, String password,
            PersonalInfoSaveDto personalInfo) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.password = password;
        this.personalInfo = personalInfo;
    }

    public User toUser() {
        return User.userBuilder()
                .firstName(firstName).lastName(lastName)
                .username(username).password(password)
                .personalInfo(personalInfo != null ? personalInfo.toPersonalInfo() : null)
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
        UserSaveDto userDto = (UserSaveDto) o;
        return Objects.equals(firstName, userDto.firstName)
                && Objects.equals(lastName, userDto.lastName)
                && Objects.equals(username, userDto.username)
                && Objects.equals(password, userDto.password)
                && Objects.equals(personalInfo, userDto.personalInfo);
    }

    @Override
    public int hashCode() {
        return Objects.hash(firstName, lastName, username, password, personalInfo);
    }
}
