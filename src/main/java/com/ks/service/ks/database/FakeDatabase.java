package com.ks.service.ks.database;

import com.ks.service.ks.model.*;

import java.util.ArrayList;
import java.util.List;

public class FakeDatabase {
    List<Product> products = new ArrayList<>();
    List<Category> categories = new ArrayList<>();
    List<Order> orders = new ArrayList<>();
    List<Customer> customers = new ArrayList<>();

    public List<Product> getAllProducts() {
        return products;
    }

    public List<Category> getAllCategories() {
        return categories;
    }

    public List<Order> getAllOrders() {
        return orders;
    }

    public List<Customer> getAllCustomers() {
        return customers;
    }

    public FakeDatabase(){
        categories.add(new Category(100, "Fruits"));
        categories.add(new Category(101, "Meat"));
        categories.add(new Category(102, "Cosmetics"));

        products.add(new Product(10001, 100, "Apple", "Fresh apples", 1.99));
        products.add(new Product(10002, 101, "Soap", "Brand new", 1.19));
        products.add(new Product(10003, 102, "Chicken drumsticks", "Fresh from Bulgaria", 4.26));
        products.add(new Product(1004,101, "Pork chops", "Our newest product!", 5.99));

        customers.add(new Customer(1, "Kristiyan Strahilov", "Rachelsmolen 1 Eindhoven", "+359894567890", 0));
        customers.add(new Customer(2, "Ivan Dimov", "Rachelsmolen 10 Eindhoven", "+359890987654", 0));

        orders.add(new Order(101,1, products, 5.45));
    }

    //Customer methods
    public boolean addCustomer(Customer customer){
        if (this.getCustomer(customer.getCustomerId()) != null)
            return false;
        else {
            this.customers.add(customer);
            return true;
        }
    }

    public Customer getCustomer(long id) {
        for (Customer customer : this.customers) {
            if (customer.getCustomerId() == id)
                return customer;
        }
        return null;
    }

    public boolean editCustomer(long id, Customer customer){
        Customer old = this.getCustomer(id);
        if (old == null){
            return false;
        }
        old.setName(customer.getName());
        old.setAddress(customer.getAddress());
        old.setPhone(customer.getPhone());
        return true;
    }

    public boolean deleteCustomer(long id){
        Customer customer = this.getCustomer(id);
        if (customer == null){
            return false;
        }
        return this.customers.remove(customer);
    }

    //Order methods
    public boolean addOrder(Order order){
        return this.orders.add(order);
    }

    public Order getOrder(long id) {
        for (Order order : this.orders) {
            if (order.getOrderNum() == id)
                return order;
        }
        return null;
    }

    public boolean editOrderStatus(long id, OrderStatus status){
        Order order = this.getOrder(id);
        if (order == null){
            return false;
        }
        order.setStatus(status);
        return true;
    }

    public boolean deleteOrder(long id){
        Order order = this.getOrder(id);
        if (order == null){
            return false;
        }
        return this.orders.remove(order);
    }

    //Product methods
    public boolean addProduct(Product product){
        if (this.getProduct(product.getId()) != null)
            return false;
        else {
            this.products.add(product);
            return true;
        }
    }

    public Product getProduct(long id) {
        for (Product product : this.products) {
            if (product.getId() == id)
                return product;
        }
        return null;
    }

    public boolean editProduct(long id, Product product){
        Product old = this.getProduct(id);
        if (old == null){
            return false;
        }
        old.setName(product.getName());
        old.setDescription(product.getDescription());
        old.setCategoryId(product.getCategoryId());
        old.setPrice(product.getPrice());
        return true;
    }

    public boolean deleteProduct(long id){
        Product product = this.getProduct(id);
        if (product == null){
            return false;
        }
        return this.products.remove(product);
    }

    //Category methods
    public void addCategory(Category category){
        this.categories.add(category);
    }

    public Category getCategory(long id) {
        for (Category category : this.categories) {
            if (category.getId() == id)
                return category;
        }
        return null;
    }

    public boolean editCategory(long id, Category category){
        Category old = this.getCategory(id);
        if (old == null){
            return false;
        }
        old.setName(category.getName());
        return true;
    }

    public boolean deleteCategory(long id){
        Category category = this.getCategory(id);
        if (category == null){
            return false;
        }
        return this.categories.remove(category);
    }
}
