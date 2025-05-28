package com.example.backend.service;

import com.example.backend.dto.BrandDTO;
import com.example.backend.model.Brand;
import com.example.backend.repository.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BrandService {

    @Autowired
    private BrandRepository brandRepository;

    public List<Brand> getAllBrands() {
        return brandRepository.findByTrashFalse();
    }

    public Brand createBrandFromDTO(BrandDTO dto) {
        if (brandRepository.existsByName(dto.getName())) {
            throw new RuntimeException("Brand already exists");
        }

        Brand brand = new Brand();
        brand.setName(dto.getName());
        brand.setDescription(dto.getDescription());
        brand.setStatus(dto.getStatus() != null ? dto.getStatus() : true);
        brand.setTrash(false);

        return brandRepository.save(brand);
    }

    public Brand getBrandById(Long id) {
        return brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand not found"));
    }

    public Brand updateBrand(Long id, BrandDTO dto) {
        Brand brand = getBrandById(id);
        brand.setName(dto.getName());
        brand.setDescription(dto.getDescription());
        brand.setStatus(dto.getStatus());
        return brandRepository.save(brand);
    }

    public Brand toggleBrandStatus(Long id) {
        Brand brand = getBrandById(id);
        brand.setStatus(!brand.getStatus());
        return brandRepository.save(brand);
    }

    public Brand moveToTrash(Long id) {
        Brand brand = getBrandById(id);
        brand.setTrash(true);
        return brandRepository.save(brand);
    }

    public void deleteBrandPermanently(Long id) {
        if (!brandRepository.existsById(id)) {
            throw new RuntimeException("Brand not found");
        }
        brandRepository.deleteById(id);
    }

    public List<Brand> getTrashedBrands() {
        return brandRepository.findByTrashTrue();
    }

    public Brand restoreBrand(Long id) {
        Brand brand = getBrandById(id);
        brand.setTrash(false);
        return brandRepository.save(brand);
    }
}
