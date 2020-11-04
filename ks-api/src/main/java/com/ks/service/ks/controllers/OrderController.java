package com.ks.service.ks.controllers;

import com.ks.service.ks.repository.OrderRepository;
import com.ks.service.ks.model.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/orders")
public class OrderController {
    @Autowired
    private OrderRepository orderRepository;

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/add")
    public ResponseEntity<Order> createOrder (@RequestBody Order order){
        orderRepository.save(order);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping // /orders
    public @ResponseBody List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable long id) {
        if (orderRepository.existsById(id))
            return new ResponseEntity(orderRepository.findById(id), HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PreAuthorize("hasRole('USER')")
    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable long id, @RequestBody Order updatedOrderStatus){
        if (orderRepository.existsById(id)){
            orderRepository.findById(id).map(order -> {
                order.setStatus(updatedOrderStatus.getStatus());
                orderRepository.save(order);
                return updatedOrderStatus;
            });
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Order> deleteOrder(@PathVariable long id){
        if (orderRepository.existsById(id)) {
            orderRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
