package com.ks.service.ks.model;

import javax.persistence.*;

@Entity(name = "ORDERS")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;
    @Lob
    private String orderedProducts;
    @Column(nullable = false, precision = 2)
    private double totalPrice = 0;
    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.Processing;

    @ManyToOne(optional = false, targetEntity = Customer.class)
    @JoinColumn(name = "customer_id", referencedColumnName = "customer_id")
    private Customer customer;

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Long getOrderId() { return orderId; }

    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getOrderedProducts() {
        return orderedProducts;
    }

    public void setOrderedProducts(String orderedProducts) {
        this.orderedProducts = orderedProducts;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public Order() {}
}
