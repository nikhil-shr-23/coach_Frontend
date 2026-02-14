package com.raghav.peadologicalbackend.repository;

import com.raghav.peadologicalbackend.entity.Lecture;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface LectureRepository extends JpaRepository<Lecture, Long> {
    List<Lecture> findByTeacherProfileId(Long teacherProfileId);
    
    // For "Recent Lectures"
    List<Lecture> findTop5ByTeacherProfileIdOrderByUploadedAtDesc(Long teacherProfileId);
    List<Lecture> findByClassSlotId(Long classSlotId);
    List<Lecture> findByTeacherProfileIdAndClassSlotId(Long teacherProfileId, Long classSlotId);

    @Query("SELECT l.teacherProfile.school, COUNT(l), AVG(l.score) FROM Lecture l GROUP BY l.teacherProfile.school")
    List<Object[]> findLectureStatsBySchool();

    @Query("SELECT l.teacherProfile.id, COUNT(l), AVG(l.score), MAX(l.uploadedAt) FROM Lecture l WHERE l.teacherProfile.school = :school GROUP BY l.teacherProfile.id")
    List<Object[]> findTeacherStatsBySchool(String school);
}
