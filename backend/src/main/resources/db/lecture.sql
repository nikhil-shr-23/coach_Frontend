CREATE TABLE IF NOT EXISTS lectures (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    lecture_title VARCHAR(255) NOT NULL,
    lecture_audio_url VARCHAR(255) NOT NULL,
    score DOUBLE NULL,
    uploaded_at TIMESTAMP NOT NULL,
    teacher_profile_id BIGINT NOT NULL,
    class_slot_id BIGINT NULL,
    CONSTRAINT fk_lectures_teacher_profile
        FOREIGN KEY (teacher_profile_id) REFERENCES teacher_profiles(id),
    CONSTRAINT fk_lectures_class_slot
        FOREIGN KEY (class_slot_id) REFERENCES class_slots(id)
);
