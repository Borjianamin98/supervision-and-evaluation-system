package ir.ac.sbu.evaluation.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import lombok.Builder;

@Entity
public class User extends BaseEntity {

    @Column(name = "username")
    private String username;
    @Column(name = "password")
    private String password;

    public User() {
    }

    @Builder
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
}
