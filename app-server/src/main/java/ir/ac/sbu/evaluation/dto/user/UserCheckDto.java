package ir.ac.sbu.evaluation.dto.user;

import lombok.Builder;

public class UserCheckDto {

    private String username;

    private boolean isAvailable;

    public UserCheckDto() {
    }

    @Builder
    public UserCheckDto(String username, boolean isAvailable) {
        this.username = username;
        this.isAvailable = isAvailable;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean available) {
        isAvailable = available;
    }
}
