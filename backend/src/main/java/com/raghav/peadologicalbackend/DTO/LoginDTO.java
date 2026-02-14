package com.raghav.peadologicalbackend.DTO;

import lombok.Data;
import lombok.NonNull;

@Data
public class LoginDTO {
    @NonNull
    String username;
    @NonNull
    String password;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

}
