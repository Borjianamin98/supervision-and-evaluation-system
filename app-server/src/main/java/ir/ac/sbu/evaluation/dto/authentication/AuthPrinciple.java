package ir.ac.sbu.evaluation.dto.authentication;

import java.util.Collection;
import lombok.Builder;
import org.springframework.security.core.GrantedAuthority;

public class AuthPrinciple {

    private final String username;
    private final Collection<GrantedAuthority> roles;

    @Builder
    public AuthPrinciple(String username, Collection<GrantedAuthority> roles) {
        this.username = username;
        this.roles = roles;
    }

    public String getUsername() {
        return username;
    }

    public Collection<GrantedAuthority> getRoles() {
        return roles;
    }

    @Override
    public String toString() {
        return "AuthPrinciple{" +
                "username='" + username + '\'' +
                ", roles=" + roles +
                '}';
    }
}
