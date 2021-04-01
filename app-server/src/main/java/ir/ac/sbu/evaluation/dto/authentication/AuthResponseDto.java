package ir.ac.sbu.evaluation.dto.authentication;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import lombok.Builder;

@JsonInclude(Include.NON_NULL)
public class AuthResponseDto {

    private final String username;
    @JsonProperty(access = Access.WRITE_ONLY)
    private final String password;

    // Valid authentication fields
    @JsonProperty("access_token")
    private final String accessToken;
    @JsonProperty("refresh_token")
    private final String refreshToken;

    // Invalid authentication fields
    private final String error;

    @Builder
    public AuthResponseDto(String username, String password, String accessToken, String refreshToken,
            String error) {
        this.username = username;
        this.password = password;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.error = error;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public String getError() {
        return error;
    }

    @Override
    public String toString() {
        return "AuthResponseDto{" +
                "username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", accessToken='" + accessToken + '\'' +
                ", refreshToken='" + refreshToken + '\'' +
                ", error='" + error + '\'' +
                '}';
    }
}
