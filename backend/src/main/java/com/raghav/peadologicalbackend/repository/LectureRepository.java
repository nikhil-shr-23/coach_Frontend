package com.raghav.peadologicalbackend.repository;

import com.raghav.peadologicalbackend.entity.Lecture;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LectureRepository extends JpaRepository<Lecture, Long> {
    List<Lecture> findByTeacherProfileId(Long teacherProfileId);
    List<Lecture> findByClassSlotId(Long classSlotId);
    List<Lecture> findByTeacherProfileIdAndClassSlotId(Long teacherProfileId, Long classSlotId);
}
