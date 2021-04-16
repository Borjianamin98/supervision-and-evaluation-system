package ir.ac.sbu.evaluation.model.user;

import ir.ac.sbu.evaluation.model.BaseEntity;
import javax.persistence.Column;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.DiscriminatorType;
import javax.persistence.Entity;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.Lob;
import javax.persistence.Table;
import lombok.Builder;

@Entity
@Table(name = "user")
@Inheritance(strategy = InheritanceType.JOINED)
public class User extends BaseEntity {

    @Column(name = "username")
    private String username;

    @Column(name = "password")
    private String password;

    @Lob
    Byte[] profilePicture;

    public User() {
    }

    @Builder(builderMethodName = "userBuilder")
    public User(Long id, String username, String password) {
        super(id);
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Byte[] getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(Byte[] profilePicture) {
        this.profilePicture = profilePicture;
    }
}
