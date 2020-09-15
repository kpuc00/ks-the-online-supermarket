package com.ks.service.ks.resources;

import com.ks.service.ks.model.Category;
import com.ks.service.ks.model.Order;
import com.ks.service.ks.model.Product;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderResources {
    @GetMapping("all")
    public List<Order> getAllOrders() {
        List<Order> orders = new ArrayList<>();
        return orders;
    }
}
