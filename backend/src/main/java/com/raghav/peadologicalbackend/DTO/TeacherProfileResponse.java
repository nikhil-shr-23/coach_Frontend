package com.raghav.peadologicalbackend.dto;

import lombok.Data;

@Data
public class TeacherProfileResponse {
    private Long id;
    private Long userId;
    private String school;
    private String department;
    private String name;
    private String email;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getSchool() { return school; }
    public void setSchool(String school) { this.school = school; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
