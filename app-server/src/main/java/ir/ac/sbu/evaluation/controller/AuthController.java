package ir.ac.sbu.evaluation.controller;

import static ir.ac.sbu.evaluation.controller.ApiPaths.API_AUTHENTICATION_ROOT_PATH;

import io.jsonwebtoken.Claims;
import ir.ac.sbu.evaluation.dto.authentication.AuthLoginDto;
import ir.ac.sbu.evaluation.dto.authentication.AuthRefreshDto;
import ir.ac.sbu.evaluation.dto.authentication.AuthResponseDto;
import ir.ac.sbu.evaluation.exception.UnauthorizedAccessException;
import ir.ac.sbu.evaluation.exception.security.InvalidJwtTokenException;
import ir.ac.sbu.evaluation.security.AuthUserDetail;
import ir.ac.sbu.evaluation.security.JwtTokenProvider;
import ir.ac.sbu.evaluation.service.user.UserService;
import java.util.stream.Stream;
import javax.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(API_AUTHENTICATION_ROOT_PATH)
public class AuthController {

    private final static String API_AUTHENTICATION_LOGIN_PATH = "/login";
    private final static String API_AUTHENTICATION_REFRESH_PATH = "/refresh";

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

    public static String[] permittedPaths() {
        return Stream.of(API_AUTHENTICATION_LOGIN_PATH, API_AUTHENTICATION_REFRESH_PATH)
                .map(path -> API_AUTHENTICATION_ROOT_PATH + path).toArray(String[]::new);
    }

    @PostMapping(path = API_AUTHENTICATION_LOGIN_PATH)
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
            throw new UnauthorizedAccessException("Invalid credential provided.");
        }

        final AuthUserDetail authUserDetail = userService.loadUserByUsername(username);
        return ResponseEntity.status(HttpStatus.OK).body(AuthResponseDto.builder()
                .token(jwtTokenProvider.generateAccessToken(authUserDetail))
                .refreshToken(jwtTokenProvider.generateRefreshToken(authUserDetail))
                .build());
    }

    @PostMapping(path = API_AUTHENTICATION_REFRESH_PATH)
    public ResponseEntity<AuthResponseDto> refresh(@Valid @RequestBody AuthRefreshDto authRefreshDto) {
        String refreshToken = authRefreshDto.getRefreshToken();
        AuthUserDetail authUserDetail;
        try {
            Claims tokenClaims = jwtTokenProvider.parseToken(refreshToken);
            jwtTokenProvider.ensureIsRefreshToken(tokenClaims);
            // Find user provided by JWT refreshToken to validate its existence.
            authUserDetail = userService.loadUserByUsername(jwtTokenProvider.getUsername(tokenClaims));
        } catch (InvalidJwtTokenException e) {
            throw new UnauthorizedAccessException(e.getMessage());
        } catch (UsernameNotFoundException e) {
            throw new UnauthorizedAccessException("Refresh token username not found.");
        }

        return ResponseEntity.status(HttpStatus.OK).body(AuthResponseDto.builder()
                .refreshToken(refreshToken).token(jwtTokenProvider.generateAccessToken(authUserDetail))
                .build());
    }

    @GetMapping(path = "/check")
    public ResponseEntity<Void> check(@ModelAttribute AuthUserDetail authUserDetail) {
        // return {@link HttpStatus.OK} if user token is valid.
        return ResponseEntity.ok().build();
    }

    @GetMapping(path = "/downloadToken")
    public ResponseEntity<AuthResponseDto> downloadToken(@ModelAttribute AuthUserDetail authUserDetail) {
        // return valid token (with shorter valid time) just to be used for download files.
        return ResponseEntity.status(HttpStatus.OK)
                .body(AuthResponseDto.builder()
                        .token(jwtTokenProvider.generateDownloadToken(authUserDetail))
                        .build());
    }

}
