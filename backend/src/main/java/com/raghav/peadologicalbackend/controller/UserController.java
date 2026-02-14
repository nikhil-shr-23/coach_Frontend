package com.raghav.peadologicalbackend.controller;

import com.raghav.peadologicalbackend.DTO.LoginDTO;
import com.raghav.peadologicalbackend.DTO.RegisterDTO;
import com.raghav.peadologicalbackend.entity.Users;
import com.raghav.peadologicalbackend.service.UserServices;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    private final UserServices userService;

    @PostMapping("/register")
    public ResponseEntity<Users> Register(@RequestBody RegisterDTO registerDTO) {
        return new ResponseEntity<>(userService.RegisterService(registerDTO), HttpStatus.CREATED);
    }
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginDTO loginDTO) {
        return new ResponseEntity<>(userService.verify(loginDTO),HttpStatus.OK);
    }
}
