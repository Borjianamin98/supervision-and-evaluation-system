package ir.ac.sbu.evaluation.dto.authentication;

import javax.validation.constraints.NotNull;

public class AuthLoginDto {

    @NotNull
    private String username;
    @NotNull
    private String password;

    public AuthLoginDto() {
    }

    public AuthLoginDto(String username, String password) {
        this.username = username;
        this.password = password;
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

    @Override
    public String toString() {
        return "AuthLoginDto{" +
                "username='" + username + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}