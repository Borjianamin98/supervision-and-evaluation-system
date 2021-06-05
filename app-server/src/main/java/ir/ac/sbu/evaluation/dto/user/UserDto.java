package ir.ac.sbu.evaluation.dto.user;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
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
@JsonInclude(Include.NON_NULL)
public class UserDto {

    @JsonProperty(access = Access.READ_ONLY)
    private long id;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @JsonProperty(access = Access.READ_ONLY)
    private String fullName;

    @NotBlank
    private String username;

    @NotBlank
    @Size(min = 8)
    @JsonProperty(access = Access.WRITE_ONLY)
    private String password;

    @JsonProperty(access = Access.READ_ONLY)
    private String role;

    @NotNull
    @Valid
    private PersonalInfoDto personalInfo;

    public UserDto() {
    }

    @Builder(builderMethodName = "userBuilder")
    public UserDto(long id,
            String firstName, String lastName, String fullName,
            String username, String password,
            String role, PersonalInfoDto personalInfo) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.fullName = fullName;
        this.username = username;
        this.password = password;
        this.role = role;
        this.personalInfo = personalInfo;
    }

    public static UserDto from(User user, boolean hasExpansionInfo) {
        return userBuilder()
                .id(user.getId())
                .username(user.getUsername()).password(user.getPassword())
                .firstName(user.getFirstName()).lastName(user.getLastName())
                .fullName(user.getFullName())
                .role(user.getRole())
                .personalInfo(hasExpansionInfo && user.getPersonalInfo() != null ? PersonalInfoDto
                        .from(user.getPersonalInfo()) : null)
                .build();
    }

    public static UserDto from(User user) {
        return from(user, false);
    }

    public User toUser() {
        return User.userBuilder()
                .firstName(firstName).lastName(lastName)
                .username(username).password(password)
                .role(role)
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
        UserDto userDto = (UserDto) o;
        return id == userDto.id && Objects.equals(firstName, userDto.firstName) && Objects
                .equals(lastName, userDto.lastName) && Objects.equals(fullName, userDto.fullName)
                && Objects.equals(username, userDto.username) && Objects
                .equals(password, userDto.password) && Objects.equals(role, userDto.role) && Objects
                .equals(personalInfo, userDto.personalInfo);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, firstName, lastName, fullName, username, password, role, personalInfo);
    }
}
