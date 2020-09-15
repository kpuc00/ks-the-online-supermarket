package com.ks.service.ks.resources;

import com.ks.service.ks.model.Category;
import com.ks.service.ks.model.Product;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductResources {
    @GetMapping("all")
    public List<Product> getAllProducts() {
        List<Product> products = new ArrayList<>();
        products.add(new Product(1, "Apple", "Fresh apples", 1.99, new Category(1, "Fruits")));
        products.add(new Product(2, "Soap", "Brand new", 1.19, new Category(3, "Cosmetics")));
        products.add(new Product(3, "Chicken drumsticks", "Fresh from Bulgaria", 4.26, new Category(2, "Meat")));
        return products;
    }
}
