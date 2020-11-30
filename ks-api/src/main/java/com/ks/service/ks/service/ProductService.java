package com.ks.service.ks.service;

import com.ks.service.ks.model.Product;
import com.ks.service.ks.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService implements IProductService {
    @Autowired
    ProductRepository productRepository;

    @Override
    public void deleteById(long id) {
        productRepository.deleteById(id);
    }

    @Override
    public Boolean existsById(long id) {
        return productRepository.existsById(id);
    }

    @Override
    public Optional<Product> findById(long id) {
        return productRepository.findById(id);
    }

    @Override
    public Product save(Product product) {
        return productRepository.save(product);
    }

    @Override
    public List<Product> findAll() {
        return productRepository.findAll();
    }

    @Override
    public Product getOne(long id) {
        return productRepository.getOne(id);
    }
}
