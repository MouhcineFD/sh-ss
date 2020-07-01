package org.sid.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collection;

@Entity
@Data @AllArgsConstructor @NoArgsConstructor @ToString
public class AppUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    @Column(unique = true) //pour avoir un user ds phpmyadmin
    private String username;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)//pour ne pas afficher dans file json le password crypter
    private String password;
    private boolean activated;
    @ManyToMany(fetch = FetchType.EAGER) //pour charger avec user les roles de user
    private Collection<AppRole> roles= new ArrayList<>();

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public boolean isActivated() {
        return activated;
    }

    public Collection<AppRole> getRoles() {
        return roles;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setActivated(boolean activated) {
        this.activated = activated;
    }

    public void setRoles(Collection<AppRole> roles) {
        this.roles = roles;
    }
}
