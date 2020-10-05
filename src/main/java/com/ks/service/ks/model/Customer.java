package com.ks.service.ks.model;

import javax.persistence.*;
import javax.validation.constraints.Email;
import java.util.List;

@Entity(name = "CUSTOMERS")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private long customerId;
    @Column(nullable = false, length = 50)
    private String name;
    @Column(length = 90)
    private String address;
    @Column(nullable = false)
    @Email
    private String email;
    @Column(nullable = false)
    private String phone;
    @Column(nullable = false, precision = 2)
    private double totalCosts = 0;

    @OneToMany(mappedBy = "customer")
    private List<Order> orders;

    public long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(long customerId) {
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public Customer() {}

    @Override
    public String toString() {
        return "Customer{" +
                "customerId=" + customerId +
                ", name='" + name + '\'' +
                ", address='" + address + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", totalCosts=" + totalCosts +
                '}';
    }
}
