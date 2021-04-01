package ir.ac.sbu.evaluation.dto.authentication;

import com.fasterxml.jackson.annotation.JsonProperty;
import javax.validation.constraints.NotBlank;

public class AuthRefreshDto {

    @NotBlank
    @JsonProperty("refresh_token")
    private String refreshToken;

    public AuthRefreshDto() {
    }

    public AuthRefreshDto(@NotBlank String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    @Override
    public String toString() {
        return "AuthRefreshDto{" +
                "refreshToken='" + refreshToken + '\'' +
                '}';
    }
}
