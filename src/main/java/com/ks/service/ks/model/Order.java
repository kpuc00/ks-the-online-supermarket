package com.ks.service.ks.model;

import java.util.List;

public class Order {
    private int orderNum;
    private int customerId;
    private List<Product> cart;
    private double totalPrice;

    public int getOrderNum() {
        return orderNum;
    }

    public void setOrderNum(int orderNum) {
        this.orderNum = orderNum;
    }

    public int getCustomerId() {
        return customerId;
    }

    public void setCustomerId(int customerId) {
        this.customerId = customerId;
    }

    public List<Product> getCart() {
        return cart;
    }

    public void setCart(List<Product> cart) {
        this.cart = cart;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public Order(int orderNum, int customerId, List<Product> cart, double totalPrice) {
        this.orderNum = orderNum;
        this.customerId = customerId;
        this.cart = cart;
        this.totalPrice = totalPrice;
    }

    public Order() {}

    @Override
    public String toString() {
        return "Order{" +
                "orderNum=" + orderNum +
                ", customerId=" + customerId +
                ", cart=" + cart +
                ", totalPrice=" + totalPrice +
                '}';
    }
}
