package ir.ac.sbu.evaluation.controller;

import ir.ac.sbu.evaluation.dto.authentication.AuthenticationRequestDto;
import ir.ac.sbu.evaluation.dto.authentication.AuthenticationResponseDto;
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
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiPaths.API_AUTHENTICATE_ROOT_PATH)
public class AuthenticationController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    public AuthenticationController(
            AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider,
            UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userService = userService;
    }

    @PostMapping(path = {"", "/"})
    public ResponseEntity<AuthenticationResponseDto> createAuthenticationToken(
            @Valid @RequestBody AuthenticationRequestDto request) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    request.getUsername(), request.getPassword()));
        } catch (DisabledException e) {
            throw new AssertionError(
                    "Unexpected exception because the deactivation feature has not been used.", e);
        } catch (LockedException e) {
            throw new AssertionError(
                    "Unexpected exception because locking user accounts for a duration has not been used.", e);
        } catch (BadCredentialsException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(AuthenticationResponseDto.forRequest(request).withError("Invalid credential provided."));
        }

        final UserDetails userDetails = userService.loadUserByUsername(request.getUsername());
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(AuthenticationResponseDto.forRequest(request)
                        .withToken(jwtTokenProvider.generateToken(userDetails.getUsername())));
    }

}
