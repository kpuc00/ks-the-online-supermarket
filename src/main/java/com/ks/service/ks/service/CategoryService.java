package com.ks.service.ks.service;

import com.ks.service.ks.model.Category;
import com.ks.service.ks.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService implements ICategoryService {
    @Autowired
    CategoryRepository categoryRepository;

    @Override
    public Category save(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    public void deleteById(long id) {
        categoryRepository.deleteById(id);
    }

    @Override
    public Boolean existsById(long id) {
        return categoryRepository.existsById(id);
    }

    @Override
    public Optional<Category> findById(long id) {
        return categoryRepository.findById(id);
    }

    @Override
    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    @Override
    public List<Category> getAllByDeletedFalse() {
        return categoryRepository.getAllByDeletedFalse();
    }

    @Override
    public List<Category> getAllByDeletedTrue() {
        return categoryRepository.getAllByDeletedTrue();
    }

    @Override
    public Category getOne(long id) {
        return categoryRepository.getOne(id);
    }
}
