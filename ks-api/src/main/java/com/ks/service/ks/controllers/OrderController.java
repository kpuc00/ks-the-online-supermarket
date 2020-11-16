package com.ks.service.ks.controllers;

import com.ks.service.ks.model.Order;
import com.ks.service.ks.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/orders")
@PreAuthorize("hasRole('USER')")
public class OrderController {
    @Autowired
    private OrderRepository orderRepository;

    @GetMapping // /orders
    public @ResponseBody
    List<Order> getAllOrderDetails() {
        return orderRepository.findAll();
    }

    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
