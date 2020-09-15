package com.ks.service.ks.resources;

import com.ks.service.ks.model.Category;
import com.ks.service.ks.model.Order;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryResources {
    @GetMapping("all")
    public List<Category> getAllCategories() {
        List<Category> categories = new ArrayList<>();
        return categories;
    }
}
