package com.example.backend.repository;

import com.example.backend.model.Brand;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BrandRepository extends JpaRepository<Brand, Long> {
    boolean existsByName(String name);
    List<Brand> findByTrashTrue();
    List<Brand> findByTrashFalse();
}
