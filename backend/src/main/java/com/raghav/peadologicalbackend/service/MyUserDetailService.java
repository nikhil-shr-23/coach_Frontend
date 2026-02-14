package com.raghav.peadologicalbackend.service;

import com.raghav.peadologicalbackend.entity.UserPrinciple;
import com.raghav.peadologicalbackend.entity.Users;
import com.raghav.peadologicalbackend.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailService implements UserDetailsService {
    @Autowired
    UserRepo repo;
    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        Users user = repo.findByUsername(identifier);
        
        if (user == null) {
            // Try finding by email
            user = repo.findByEmail(identifier);
        }

        if (user == null){
            throw new UsernameNotFoundException("User Not Found");

        }
        return new UserPrinciple(user);
    }
}

