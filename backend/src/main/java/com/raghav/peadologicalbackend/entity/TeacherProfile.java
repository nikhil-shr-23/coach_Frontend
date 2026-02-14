package com.raghav.peadologicalbackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "teacher_profiles")
public class TeacherProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private Users user;

    public Users getUser() { return user; }


    @Column
    private String school;

    @Column
    private String department;

    @Column
    private String designation;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public void setUser(Users user) { this.user = user; }
    public String getSchool() { return school; }
    public void setSchool(String school) { this.school = school; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

}
