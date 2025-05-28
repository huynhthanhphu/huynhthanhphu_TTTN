package com.example.backend.dto;

public class BrandDTO {
    private String name;
    private String description;
    private Boolean status;
    
    // Constructors
    public BrandDTO() {
    }

    public BrandDTO(String name, String description, Boolean status) {
        this.name = name;
        this.description = description;
        this.status = status;
    }

    // Getters & Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }
}
