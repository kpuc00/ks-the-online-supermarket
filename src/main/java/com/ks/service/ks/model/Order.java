package com.ks.service.ks.model;

import java.util.List;

public class Order {
    private final long orderNum;
    private final long customerId;
    private List<Product> orderedProducts;
    private double totalPrice;
    private OrderStatus status;

    public long getOrderNum() {
        return orderNum;
    }

    public long getCustomerId() {
        return customerId;
    }

    public List<Product> getOrderedProducts() {
        return orderedProducts;
    }

    public void setOrderedProducts(List<Product> orderedProducts) {
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

    public Order(long orderNum, long customerId, List<Product> orderedProducts, double totalPrice) {
        this.orderNum = orderNum;
        this.customerId = customerId;
        this.orderedProducts = orderedProducts;
        this.totalPrice = totalPrice;
        this.status = OrderStatus.Processing;
    }

    @Override
    public String toString() {
        return "Order{" +
                "orderNum=" + orderNum +
                ", customerId=" + customerId +
                ", orderedProducts=" + orderedProducts +
                ", totalPrice=" + totalPrice +
                ", status=" + status +
                '}';
    }
}
