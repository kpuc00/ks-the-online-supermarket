package com.ks.service.ks.database;

import com.ks.service.ks.model.Category;
import org.springframework.data.repository.CrudRepository;

public interface CategoryRepository extends CrudRepository<Category, Integer> {}
