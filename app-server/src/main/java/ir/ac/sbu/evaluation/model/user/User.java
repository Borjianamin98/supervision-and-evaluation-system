package ir.ac.sbu.evaluation.model.user;

import ir.ac.sbu.evaluation.model.BaseEntity;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "user")
@Getter
@Setter
@Inheritance(strategy = InheritanceType.JOINED)
public class User extends BaseEntity {

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "username")
    private String username;

    @Column(name = "password")
    private String password;

    @Column(name = "role")
    private String role;

    @OneToOne
    @JoinColumn(name = "personal_info", referencedColumnName = "id")
    private PersonalInfo personalInfo;

    @Lob
    private Byte[] profilePicture;

    public User() {
    }

    @Builder(builderMethodName = "userBuilder")
    public User(Long id, String firstName, String lastName, String username, String password, String role,
            PersonalInfo personalInfo, Byte[] profilePicture) {
        super(id);
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.password = password;
        this.role = role;
        this.personalInfo = personalInfo;
        this.profilePicture = profilePicture;
    }

    public String getFullName() {
        return getFirstName() + " " + getLastName();
    }

    @Override
    public String toString() {
        return "User{" +
                "super=" + super.toString() +
                ", lastName='" + lastName + '\'' +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", role='" + role + '\'' +
                ", personalInfo=" + personalInfo +
                "}";
    }
}
