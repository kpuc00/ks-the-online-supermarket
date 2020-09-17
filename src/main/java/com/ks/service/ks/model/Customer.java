package com.ks.service.ks.model;

import java.util.List;

public class Customer {
    private final long customerId;
    private String name;
    private String address;
    private String phone;
    private double totalCosts;

    public long getCustomerId() {
        return customerId;
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

    public double getTotalCosts() {
        return totalCosts;
    }

    public void setTotalCosts(double totalCosts) {
        this.totalCosts = totalCosts;
    }

    public Customer(long customerId, String name, String address, String phone, double totalCosts) {
        this.customerId = customerId;
        this.name = name;
        this.address = address;
        this.phone = phone;
        this.totalCosts = totalCosts;
    }

    @Override
    public String toString() {
        return "Customer{" +
                "customerId=" + customerId +
                ", name='" + name + '\'' +
                ", address='" + address + '\'' +
                ", phone='" + phone + '\'' +
                ", totalCosts=" + totalCosts +
                '}';
    }
}
