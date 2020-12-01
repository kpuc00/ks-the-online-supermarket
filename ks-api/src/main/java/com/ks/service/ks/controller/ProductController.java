package com.ks.service.ks.controller;

import com.ks.service.ks.model.Product;
import com.ks.service.ks.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        productService.save(product);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping // /products
    public @ResponseBody
    List<Product> getAllProducts() {
        return productService.getAllByDeletedFalse();
    }

    @GetMapping("/category/{id}")
    public @ResponseBody
    List<Product> getAllProductsByCategoryId(@PathVariable long id) {
        return productService.getAllByCategory_CategoryId(id);
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public @ResponseBody
    List<Product> getAllProductsAdmin() {
        return productService.getAllByDeletedFalse();
    }

    @GetMapping("/deleted")
    @PreAuthorize("hasRole('ADMIN')")
    public @ResponseBody
    List<Product> getAllDeletedProducts() {
        return productService.getAllByDeletedTrue();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable long id) {
        if (productService.existsById(id))
            return new ResponseEntity(productService.findById(id), HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> updateProduct(@PathVariable long id, @RequestBody Product updatedProduct) {
        if (productService.existsById(id)) {
            Product product = productService.getOne(id);
            product.setName(updatedProduct.getName());
            product.setDescription(updatedProduct.getDescription());
            product.setPrice(updatedProduct.getPrice());
            product.setCategory(updatedProduct.getCategory());
            product.setImage(updatedProduct.getImage());
            productService.save(product);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> deleteProduct(@PathVariable long id) {
        if (productService.existsById(id)) {
            Product product = productService.getOne(id);
            product.setDeleted(true);
            productService.save(product);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/restore/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> restoreProduct(@PathVariable long id) {
        if (productService.existsById(id)) {
            Product product = productService.getOne(id);
            product.setDeleted(false);
            productService.save(product);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
