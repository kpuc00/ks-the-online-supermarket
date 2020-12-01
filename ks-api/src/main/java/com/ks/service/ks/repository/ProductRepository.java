package com.ks.service.ks.repository;

import com.ks.service.ks.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> getAllByDeletedFalse();

    List<Product> getAllByDeletedTrue();

    List<Product> getAllByCategory_CategoryId(Long id);
}
