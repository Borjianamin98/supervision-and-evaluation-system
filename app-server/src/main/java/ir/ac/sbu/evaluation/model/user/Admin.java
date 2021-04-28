package ir.ac.sbu.evaluation.model.user;

import ir.ac.sbu.evaluation.security.SecurityRoles;
import javax.persistence.Entity;
import javax.persistence.Table;
import lombok.Builder;

@Entity
@Table(name = "admin")
public class Admin extends User {

    public Admin() {
    }

    @Builder
    public Admin(Long id, String firstName, String lastName, String username, String password,
            PersonalInfo personalInfo, Byte[] profilePicture) {
        super(id, firstName, lastName, username, password, SecurityRoles.ADMIN_ROLE_NAME, personalInfo, profilePicture);
    }

}
