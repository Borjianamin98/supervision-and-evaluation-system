package ir.ac.sbu.evaluation.dto.authentication;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

public class AuthenticationResponseDto {

    private final String username;
    @JsonProperty(access = Access.WRITE_ONLY)
    private final String password;
    @JsonInclude(Include.NON_NULL)
    private String token;
    @JsonInclude(Include.NON_NULL)
    private String error;

    private AuthenticationResponseDto(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public static AuthenticationResponseDto forRequest(AuthenticationRequestDto requestDto) {
        return new AuthenticationResponseDto(requestDto.getUsername(), requestDto.getPassword());
    }

    public AuthenticationResponseDto withError(String error) {
        this.error = error;
        return this;
    }

    public AuthenticationResponseDto withToken(String token) {
        this.token = token;
        return this;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getToken() {
        return token;
    }

    public String getError() {
        return error;
    }
}
