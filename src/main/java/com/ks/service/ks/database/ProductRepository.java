package com.ks.service.ks.database;

import com.ks.service.ks.model.Product;
import org.springframework.data.repository.CrudRepository;

public interface ProductRepository extends CrudRepository<Product, Integer> {}
