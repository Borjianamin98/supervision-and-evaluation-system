package ir.ac.sbu.evaluation.dto.user;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import ir.ac.sbu.evaluation.model.user.User;
import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.Builder;

@JsonInclude(Include.NON_NULL)
public class UserDto {

    @JsonProperty(access = Access.READ_ONLY)
    private long id;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotBlank
    private String username;

    @NotBlank
    @JsonProperty(access = Access.WRITE_ONLY)
    private String password;

    @NotNull
    @Valid
    private PersonalInfoDto personalInfo;

    public UserDto() {
    }

    @Builder
    public UserDto(long id, String firstName, String lastName, String username, String password,
            PersonalInfoDto personalInfo) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.password = password;
        this.personalInfo = personalInfo;
    }

    public static UserDto from(User user) {
        return builder()
                .id(user.getId())
                .username(user.getUsername()).password(user.getPassword())
                .firstName(user.getFirstName()).lastName(user.getLastName())
                .personalInfo(user.getPersonalInfo() != null ? PersonalInfoDto.from(user.getPersonalInfo()) : null)
                .build();
    }

    public User toUser() {
        return User.userBuilder()
                .firstName(firstName).lastName(lastName)
                .username(username).password(password)
                .personalInfo(personalInfo != null ? personalInfo.toPersonalInfo() : null)
                .build();
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public PersonalInfoDto getPersonalInfo() {
        return personalInfo;
    }

    public void setPersonalInfo(PersonalInfoDto personalInfo) {
        this.personalInfo = personalInfo;
    }
}
