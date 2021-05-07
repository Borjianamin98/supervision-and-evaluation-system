package ir.ac.sbu.evaluation.security;

import org.springframework.stereotype.Component;

@Component("SecurityRoles")
public class SecurityRoles {

    public static final String STUDENT_ROLE_NAME = "ROLE_STUDENT";
    public static final String MASTER_ROLE_NAME = "ROLE_MASTER";
    public static final String ADMIN_ROLE_NAME = "ROLE_ADMIN";

    private SecurityRoles() {
    }
}
