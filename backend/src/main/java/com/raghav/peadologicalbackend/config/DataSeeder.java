package com.raghav.peadologicalbackend.config;

import com.raghav.peadologicalbackend.entity.Roles;
import com.raghav.peadologicalbackend.entity.Users;
import com.raghav.peadologicalbackend.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepo userRepo;

    @Override
    public void run(String... args) throws Exception {
        if (userRepo.findByUsername("superadmin") == null) {
            Users superAdmin = new Users();
            superAdmin.setName("Super Admin");
            superAdmin.setEmail("superadmin@peadological.com"); 
            superAdmin.setUsername("superadmin");
            superAdmin.setPassword(new BCryptPasswordEncoder(12).encode("superadmin123"));
            superAdmin.setRoles(Roles.SUPER_ADMIN);
            superAdmin.setCreatedAt(LocalDateTime.now());
            
            userRepo.save(superAdmin);
            System.out.println("Superadmin user created successfully.");
        }
    }
}
