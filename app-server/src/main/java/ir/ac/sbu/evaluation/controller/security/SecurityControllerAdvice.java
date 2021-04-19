package ir.ac.sbu.evaluation.controller.security;

import ir.ac.sbu.evaluation.dto.authentication.AuthPrinciple;
import ir.ac.sbu.evaluation.dto.authentication.AuthPrinciple.AuthPrincipleBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

@ControllerAdvice
public class SecurityControllerAdvice {

    @ModelAttribute
    public AuthPrinciple customPrincipal(Authentication authentication) {
        AuthPrincipleBuilder authPrincipleBuilder = AuthPrinciple.builder();

        if (authentication == null || authentication.getPrincipal() == null) {
            return authPrincipleBuilder.build();
        }
        User principal = (User) authentication.getPrincipal();
        return authPrincipleBuilder.username(principal.getUsername()).roles(principal.getAuthorities()).build();
    }
}
