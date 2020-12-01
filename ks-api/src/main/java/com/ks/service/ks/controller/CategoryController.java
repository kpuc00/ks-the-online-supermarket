package com.ks.service.ks.controller;

import com.ks.service.ks.model.Category;
import com.ks.service.ks.service.CategoryService;
import com.ks.service.ks.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/categories")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @Autowired
    private ProductService productService;

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        categoryService.save(category);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping // /categories
    public @ResponseBody
    List<Category> getAllViewableCategories() {
        return categoryService.getAllByDeletedFalse();
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public @ResponseBody
    List<Category> getAllCategoriesInAdmin() {
        return categoryService.getAllByDeletedFalse();
    }

    @GetMapping("/deleted")
    @PreAuthorize("hasRole('ADMIN')")
    public @ResponseBody
    List<Category> getAllDeletedCategories() {
        return categoryService.getAllByDeletedTrue();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable long id) {
        if (categoryService.existsById(id))
            return new ResponseEntity(categoryService.findById(id), HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable long id, @RequestBody Category updatedCategory) {
        if (categoryService.existsById(id)) {
            Category category = categoryService.getOne(id);
            category.setName(updatedCategory.getName());
            categoryService.save(category);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Category> deleteCategory(@PathVariable long id) {
        if (categoryService.existsById(id)) {
            Category category = categoryService.getOne(id);
            category.setDeleted(true);
            categoryService.save(category);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
