package com.raghav.peadologicalbackend.repository;

import com.raghav.peadologicalbackend.entity.ClassEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClassRepository extends JpaRepository<ClassEntity, Long> {
    List<ClassEntity> findByTimetableId(Long timetableId);
}
