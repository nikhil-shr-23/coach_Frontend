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
    private final com.raghav.peadologicalbackend.repository.TeacherProfileRepository teacherProfileRepo;

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

        if (userRepo.findByUsername("dean_soet") == null) {
            Users dean = new Users();
            dean.setName("Dean SOET");
            dean.setEmail("dean.soet@krmangalam.edu.in");
            dean.setUsername("dean_soet");
            dean.setPassword(new BCryptPasswordEncoder(12).encode("dean123"));
            dean.setRoles(Roles.ADMIN);
            dean.setCreatedAt(LocalDateTime.now());
            dean = userRepo.save(dean);

            // Create Profile for Dean (linked to School)
            com.raghav.peadologicalbackend.entity.TeacherProfile deanProfile = new com.raghav.peadologicalbackend.entity.TeacherProfile();
            deanProfile.setUser(dean);
            deanProfile.setSchool("School of Engineering & Technology");
            deanProfile.setDepartment("Administrative");
            teacherProfileRepo.save(deanProfile);
            System.out.println("Dean user created.");
        }

        if (userRepo.findByUsername("teacher_ananya") == null) {
            Users teacher = new Users();
            teacher.setName("Dr. Ananya Mehta");
            teacher.setEmail("ananya.mehta@krmangalam.edu.in");
            teacher.setUsername("teacher_ananya");
            teacher.setPassword(new BCryptPasswordEncoder(12).encode("teacher123"));
            teacher.setRoles(Roles.TEACHER);
            teacher.setCreatedAt(LocalDateTime.now());
            teacher = userRepo.save(teacher);

            com.raghav.peadologicalbackend.entity.TeacherProfile teacherProfile = new com.raghav.peadologicalbackend.entity.TeacherProfile();
            teacherProfile.setUser(teacher);
            teacherProfile.setSchool("School of Engineering & Technology");
            teacherProfile.setDepartment("Computer Science & Engineering");
            teacherProfileRepo.save(teacherProfile);
             System.out.println("Teacher user created.");
        }
    }
}
