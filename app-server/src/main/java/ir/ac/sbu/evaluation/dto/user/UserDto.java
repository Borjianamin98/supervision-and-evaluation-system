package ir.ac.sbu.evaluation.dto.user;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import ir.ac.sbu.evaluation.model.user.User;
import java.util.Objects;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(Include.NON_NULL)
public class UserDto {

    private long id;
    private String firstName;
    private String lastName;
    private String fullName;
    private String username;
    private String role;
    private PersonalInfoDto personalInfo;

    public UserDto() {
    }

    @Builder(builderMethodName = "userBuilder")
    public UserDto(long id,
            String firstName, String lastName, String fullName,
            String username,
            String role, PersonalInfoDto personalInfo) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.fullName = fullName;
        this.username = username;
        this.role = role;
        this.personalInfo = personalInfo;
    }

    public static UserDto from(User user, boolean hasExpansionInfo) {
        return userBuilder()
                .id(user.getId())
                .username(user.getUsername())
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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        UserDto userDto = (UserDto) o;
        return id == userDto.id
                && Objects.equals(firstName, userDto.firstName)
                && Objects.equals(lastName, userDto.lastName)
                && Objects.equals(fullName, userDto.fullName)
                && Objects.equals(username, userDto.username)
                && Objects.equals(role, userDto.role)
                && Objects.equals(personalInfo, userDto.personalInfo);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, firstName, lastName, fullName, username, role, personalInfo);
    }
}
