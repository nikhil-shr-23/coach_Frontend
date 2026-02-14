package com.raghav.peadologicalbackend.repo;

import com.raghav.peadologicalbackend.entity.Users;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<Users, Long> {
    Users findByUsername(@NonNull String username);
    Users findByEmail(@NonNull String email);
}
