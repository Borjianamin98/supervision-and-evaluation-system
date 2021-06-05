package ir.ac.sbu.evaluation.dto.authentication;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import java.util.Objects;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        AuthResponseDto that = (AuthResponseDto) o;
        return Objects.equals(username, that.username) && Objects.equals(password, that.password)
                && Objects.equals(accessToken, that.accessToken) && Objects
                .equals(refreshToken, that.refreshToken);
    }

    @Override
    public int hashCode() {
        return Objects.hash(username, password, accessToken, refreshToken);
    }
}
