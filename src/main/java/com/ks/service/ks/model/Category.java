package com.ks.service.ks.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity(name = "CATEGORIES")
public class Category {
    @Id
    @GeneratedValue
    private long categoryId;
    private String name;

    public long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(long categoryId) {
        this.categoryId = categoryId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Category() {}

    @Override
    public String toString() {
        return "Category{" +
                "categoryId=" + categoryId +
                ", name='" + name + '\'' +
                '}';
    }
}
