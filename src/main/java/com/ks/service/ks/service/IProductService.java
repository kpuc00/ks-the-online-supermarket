package com.ks.service.ks.service;

import com.ks.service.ks.model.Product;

import java.util.List;
import java.util.Optional;

public interface IProductService {

    void deleteById(long id);

    Boolean existsById(long id);

    Optional<Product> findById(long id);

    Product save(Product product);

    List<Product> searchNotDeletedProducts(String search);

    List<Product> findAll();

    List<Product> getAllByDeletedFalse();

    List<Product> getAllByDeletedTrue();

    Product getOne(long id);
}
