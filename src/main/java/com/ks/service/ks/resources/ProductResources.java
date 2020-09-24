package com.ks.service.ks.resources;

import com.ks.service.ks.database.ProductRepository;
import com.ks.service.ks.model.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/products")
public class ProductResources {
    @Autowired
    private ProductRepository productRepository;

    @PostMapping("/add")
    public ResponseEntity<Product> createProduct (@RequestBody Product product){
        productRepository.save(product);
        return new ResponseEntity<>(product, HttpStatus.CREATED);
    }

    @GetMapping // /products
    public @ResponseBody Iterable<Product> getAllProducts() {
        return productRepository.findAll();
    }
/*
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable long id) {
        Product product = fakeDb.getProduct(id);
        if (product != null)
            return new ResponseEntity<>(fakeDb.getProduct(id), HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable long id, @RequestBody Product product){
        if (fakeDb.editProduct(id, product))
            return new ResponseEntity<>(product, HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Product> deleteProduct(@PathVariable long id){
        if (fakeDb.deleteProduct(id))
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

 */
}
