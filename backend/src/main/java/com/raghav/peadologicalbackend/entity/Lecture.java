package com.raghav.peadologicalbackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "lectures")
public class Lecture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String lectureTitle;

    @Column(nullable = false)
    private String lectureAudioUrl;

    @Column
    private Double score;

    @Column(nullable = false)
    private LocalDateTime uploadedAt;

    @Column(columnDefinition = "TEXT")
    private String analysisContent;

    @Column(columnDefinition = "TEXT")
    private String scoreReasoning;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "teacher_profile_id", nullable = false)
    private TeacherProfile teacherProfile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_slot_id")
    private ClassEntity classSlot;

    @PrePersist
    private void onCreate() {
        if (uploadedAt == null) {
            uploadedAt = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getLectureTitle() { return lectureTitle; }
    public void setLectureTitle(String lectureTitle) { this.lectureTitle = lectureTitle; }
    public String getLectureAudioUrl() { return lectureAudioUrl; }
    public void setLectureAudioUrl(String lectureAudioUrl) { this.lectureAudioUrl = lectureAudioUrl; }
    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }
    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
    public String getAnalysisContent() { return analysisContent; }
    public void setAnalysisContent(String analysisContent) { this.analysisContent = analysisContent; }
    public String getScoreReasoning() { return scoreReasoning; }
    public void setScoreReasoning(String scoreReasoning) { this.scoreReasoning = scoreReasoning; }
    public TeacherProfile getTeacherProfile() { return teacherProfile; }
    public void setTeacherProfile(TeacherProfile teacherProfile) { this.teacherProfile = teacherProfile; }
    public ClassEntity getClassSlot() { return classSlot; }
    public void setClassSlot(ClassEntity classSlot) { this.classSlot = classSlot; }
}
