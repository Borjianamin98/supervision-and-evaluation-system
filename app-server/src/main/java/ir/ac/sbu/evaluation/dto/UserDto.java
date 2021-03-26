package ir.ac.sbu.evaluation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import ir.ac.sbu.evaluation.model.User;
import javax.validation.constraints.NotBlank;
import lombok.Builder;

public class UserDto {

    @NotBlank
    private String username;
    @NotBlank
    @JsonProperty(access = Access.WRITE_ONLY)
    private String password;

    public UserDto() {
    }

    @Builder
    public UserDto(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public static UserDto from(User user) {
        return new UserDto(user.getUsername(), user.getPassword());
    }

    public User toUser() {
        return User.builder().username(username).password(password).build();
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
