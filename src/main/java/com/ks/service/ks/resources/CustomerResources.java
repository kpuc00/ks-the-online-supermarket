package com.ks.service.ks.resources;

import com.ks.service.ks.model.Customer;
import com.ks.service.ks.model.Order;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/customers")
public class CustomerResources {
    @GetMapping("all")
    public List<Customer> getAllCustomers() {
        List<Customer> customers = new ArrayList<>();
        return customers;
    }
}
