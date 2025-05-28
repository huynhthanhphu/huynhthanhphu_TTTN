package com.example.backend.controller;

import com.example.backend.dto.BrandDTO;
import com.example.backend.model.Brand;
import com.example.backend.service.BrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brands")
@CrossOrigin(origins = "*")
public class BrandController {

    @Autowired
    private BrandService brandService;

    // 1. Lấy tất cả brand
    @GetMapping
    public List<Brand> getAllBrands() {
        return brandService.getAllBrands();
    }

    // 2. Lấy brand theo ID
    @GetMapping("/{id}")
    public Brand getBrandById(@PathVariable Long id) {
        return brandService.getBrandById(id);
    }

    // 3. Tạo brand mới
    @PostMapping
    public Brand createBrand(@RequestBody BrandDTO dto) {
        return brandService.createBrandFromDTO(dto);
    }

    // 4. Cập nhật brand
    @PutMapping("/{id}")
    public Brand updateBrand(@PathVariable Long id, @RequestBody BrandDTO dto) {
        return brandService.updateBrand(id, dto);
    }

    // 5. Thay đổi trạng thái
    @PutMapping("/status/{id}")
    public Brand changeStatus(@PathVariable Long id) {
        return brandService.toggleBrandStatus(id);
    }

    // 6. Xoá tạm (vào thùng rác)
    @PutMapping("/trash/{id}")
    public Brand softDeleteBrand(@PathVariable Long id) {
        return brandService.moveToTrash(id);
    }

    // 7. Xoá thật
    @DeleteMapping("/{id}")
    public void deleteBrand(@PathVariable Long id) {
        brandService.deleteBrandPermanently(id);
    }

    // 8. Lấy danh sách trong thùng rác
    @GetMapping("/trash")
    public List<Brand> getTrashedBrands() {
        return brandService.getTrashedBrands();
    }

    // 9. Khôi phục từ thùng rác
    @PutMapping("/restore/{id}")
    public Brand restoreBrand(@PathVariable Long id) {
        return brandService.restoreBrand(id);
    }
}
