package com.raghav.peadologicalbackend.DTO;

import lombok.Data;
import lombok.NonNull;

@Data
public class LoginDTO {
    @NonNull
    String username;
    @NonNull
    String password;

}
