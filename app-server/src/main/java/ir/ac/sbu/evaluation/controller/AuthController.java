package ir.ac.sbu.evaluation.controller;

import io.jsonwebtoken.Claims;
import ir.ac.sbu.evaluation.dto.authentication.AuthLoginDto;
import ir.ac.sbu.evaluation.dto.authentication.AuthRefreshDto;
import ir.ac.sbu.evaluation.dto.authentication.AuthResponseDto;
import ir.ac.sbu.evaluation.exception.InvalidJwtTokenException;
import ir.ac.sbu.evaluation.security.AuthUserDetail;
import ir.ac.sbu.evaluation.security.JwtTokenProvider;
import ir.ac.sbu.evaluation.service.UserService;
import javax.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiPaths.API_AUTHENTICATION_ROOT_PATH)
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    public AuthController(
            AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider,
            UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userService = userService;
    }

    @PostMapping(path = "/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody AuthLoginDto request) {
        String username = request.getUsername();
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, request.getPassword()));
        } catch (DisabledException e) {
            throw new AssertionError(
                    "Unexpected exception because the deactivation feature has not been used.", e);
        } catch (LockedException e) {
            throw new AssertionError(
                    "Unexpected exception because locking user accounts for a duration has not been used.", e);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(AuthResponseDto.builder()
                    .username(username).error("Invalid credential provided.").build());
        }

        final AuthUserDetail authUserDetail = userService.loadUserByUsername(username);
        return ResponseEntity.status(HttpStatus.OK).body(AuthResponseDto.builder().username(username)
                .accessToken(jwtTokenProvider.generateAccessToken(authUserDetail))
                .refreshToken(jwtTokenProvider.generateRefreshToken(authUserDetail))
                .build());
    }

    @PostMapping(path = "/refresh")
    public ResponseEntity<AuthResponseDto> refresh(@Valid @RequestBody AuthRefreshDto authRefreshDto) {
        String refreshToken = authRefreshDto.getRefreshToken();
        AuthUserDetail authUserDetail;
        try {
            Claims tokenClaims = jwtTokenProvider.parseToken(refreshToken);
            jwtTokenProvider.ensureIsRefreshToken(tokenClaims);
            // Find user provided by JWT refreshToken to validate its existence.
            authUserDetail = userService.loadUserByUsername(jwtTokenProvider.getUsername(tokenClaims));
        } catch (InvalidJwtTokenException e) {
            return refreshTokenResponseWithError(refreshToken, e.getMessage());
        } catch (UsernameNotFoundException e) {
            return refreshTokenResponseWithError(refreshToken, "Refresh token username not found.");
        }

        return ResponseEntity.status(HttpStatus.OK).body(AuthResponseDto.builder()
                .refreshToken(refreshToken).accessToken(jwtTokenProvider.generateAccessToken(authUserDetail))
                .build());
    }

    private ResponseEntity<AuthResponseDto> refreshTokenResponseWithError(String refreshToken, String error) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(AuthResponseDto.builder()
                .refreshToken(refreshToken).error(error).build());
    }

}
