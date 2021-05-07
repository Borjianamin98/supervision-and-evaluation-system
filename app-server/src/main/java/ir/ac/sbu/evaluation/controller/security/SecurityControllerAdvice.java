package ir.ac.sbu.evaluation.controller.security;

import ir.ac.sbu.evaluation.security.AuthUserDetail;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

@ControllerAdvice
public class SecurityControllerAdvice {

    @ModelAttribute
    public AuthUserDetail customPrincipal(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return AuthUserDetail.builder().build();
        }
        return (AuthUserDetail) authentication.getPrincipal();
    }
}
