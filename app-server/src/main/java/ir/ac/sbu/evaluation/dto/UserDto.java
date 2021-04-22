package ir.ac.sbu.evaluation.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import ir.ac.sbu.evaluation.model.user.User;
import javax.validation.constraints.NotBlank;
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

    public UserDto() {
    }

    @Builder
    public UserDto(long id, String firstName, String lastName,
            String username, String password) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.password = password;
    }

    public static UserDto from(User user) {
        return builder()
                .id(user.getId())
                .username(user.getUsername()).password(user.getPassword())
                .firstName(user.getFirstName()).lastName(user.getLastName())
                .build();
    }

    public User toUser() {
        return User.userBuilder()
                .firstName(firstName).lastName(lastName)
                .username(username).password(password)
                .build();
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
}
