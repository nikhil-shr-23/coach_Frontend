package com.raghav.peadologicalbackend.service;

import com.raghav.peadologicalbackend.DTO.LoginDTO;
import com.raghav.peadologicalbackend.DTO.RegisterDTO;
import com.raghav.peadologicalbackend.entity.Roles;
import com.raghav.peadologicalbackend.entity.Users;
import com.raghav.peadologicalbackend.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserServices {
    private  final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private  final UserRepo userRepo;


    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
    @Transactional(rollbackFor = Exception.class,isolation = Isolation.REPEATABLE_READ)
    public Users RegisterService(RegisterDTO dto){
        Users user = new Users();
        user.setUsername(dto.getUsername());
        user.setPassword(encoder.encode(dto.getPassword()));
        user.setRoles(Roles.valueOf("ADMIN"));
        user.setCreatedAt(LocalDateTime.now());
        userRepo.save(user);
        return user;
    }

    public String verify(LoginDTO dto){
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        dto.getUsername(),
                        dto.getPassword()
                ));
        // Support login by username OR email
        Users user = userRepo.findByUsername(dto.getUsername());
        if (user == null) {
            user = userRepo.findByEmail(dto.getUsername());
        }
        if (user == null) {
            throw new RuntimeException("User not found after authentication");
        }
        return jwtService.genrateToken(user.getUsername(), String.valueOf(user.getRoles()));
    }
}

