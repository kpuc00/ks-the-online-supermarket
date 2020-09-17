package com.ks.service.ks.model;

public class Product {
    private final long id;
    private long categoryId;
    private String name;
    private String description;
    private double price;

    public long getId() { return id; }

    public long getCategoryId() { return categoryId; }

    public void setCategoryId(long categoryId) { this.categoryId = categoryId; }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public Product(long id, long categoryId, String name, String description, double price) {
        this.id = id;
        this.categoryId = categoryId;
        this.name = name;
        this.description = description;
        this.price = price;
    }

    @Override
    public String toString() {
        return "Product{" +
                "id=" + id +
                ", categoryId=" + categoryId +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", price=" + price +
                '}';
    }
}
