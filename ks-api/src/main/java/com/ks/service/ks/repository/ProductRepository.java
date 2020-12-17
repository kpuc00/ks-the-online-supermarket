package com.ks.service.ks.repository;

import com.ks.service.ks.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("FROM PRODUCTS p WHERE p.name LIKE %:search% AND p.deleted=false")
    List<Product> searchNotDeletedProducts(@Param("search") String search);

    List<Product> getAllByDeletedFalse();

    List<Product> getAllByDeletedTrue();

    List<Product> getAllByCategory_CategoryId(Long id);
}
