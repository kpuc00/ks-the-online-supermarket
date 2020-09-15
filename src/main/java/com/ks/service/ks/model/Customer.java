package com.ks.service.ks.model;

import java.util.List;

public class Customer {
    private int customerId;
    private String name;
    private String address;
    private String phone;
    private List<Order> orders;
    private double totalCosts;

    public int getCustomerId() {
        return customerId;
    }

    public void setCustomerId(int customerId) {
        this.customerId = customerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public List<Order> getOrders() {
        return orders;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }

    public double getTotalCosts() {
        return totalCosts;
    }

    public void setTotalCosts(double totalCosts) {
        this.totalCosts = totalCosts;
    }

    public Customer(int customerId, String name, String address, String phone, List<Order> orders, double totalCosts) {
        this.customerId = customerId;
        this.name = name;
        this.address = address;
        this.phone = phone;
        this.orders = orders;
        this.totalCosts = totalCosts;
    }

    public Customer() {}

    @Override
    public String toString() {
        return "Customer{" +
                "customerId=" + customerId +
                ", name='" + name + '\'' +
                ", address='" + address + '\'' +
                ", phone='" + phone + '\'' +
                ", orders=" + orders +
                ", totalCosts=" + totalCosts +
                '}';
    }
}
