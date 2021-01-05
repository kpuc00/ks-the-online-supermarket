package com.ks.service.ks.service;

import com.ks.service.ks.model.Category;

import java.util.List;
import java.util.Optional;

public interface ICategoryService {
    Category save(Category category);

    void deleteById(long id);

    Boolean existsById(long id);

    Optional<Category> findById(long id);

    List<Category> findAll();

    List<Category> getAllByDeletedFalse();

    List<Category> getAllByDeletedTrue();

    Category getOne(long id);
}
