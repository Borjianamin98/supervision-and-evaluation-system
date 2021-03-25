package ir.ac.sbu.evaluation.dto;

import ir.ac.sbu.evaluation.model.User;

public class UserDto {

    private String username;
    private String password;

    public UserDto() {
    }

    public UserDto(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public static UserDto from(User user) {
        return new UserDto(user.getUsername(), user.getPassword());
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
