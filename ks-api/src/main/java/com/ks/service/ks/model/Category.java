package com.ks.service.ks.model;

import javax.persistence.*;
import java.util.List;

@Entity(name = "CATEGORIES")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long categoryId;
    @Column(nullable = false, length = 50)
    private String name;

    @OneToMany(mappedBy = "category")
    private List<Product> products;

    public Long getCategoryId() { return categoryId; }

    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Category() {}
}
