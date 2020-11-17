package com.ks.service.ks.controllers;

import com.ks.service.ks.model.Order;
import com.ks.service.ks.model.OrderStatus;
import com.ks.service.ks.model.User;
import com.ks.service.ks.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/orders")
@PreAuthorize("hasRole('USER')")
public class OrderController {
    @Autowired
    private OrderRepository orderRepository;

    @PostMapping("/user")
    public @ResponseBody
    List<Order> getUserAllOrders(@RequestBody User user) {
        return orderRepository.getAllByUser_Id(user.getId());
    }

    @PostMapping("/cart")
    public ResponseEntity<Order> getCart(@RequestBody User user) {
        List<Order> orders = orderRepository.getAllByUser_Id(user.getId());
        Order cart = null;
        for (Order o : orders) {
            if (o.getStatus() == OrderStatus.NOT_CONFIRMED_BY_USER)
                cart = o;
        }
        if (cart != null)
            return new ResponseEntity<Order>(cart, HttpStatus.OK);
        else return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping // /orders
    public @ResponseBody
    List<Order> getAllOrderDetails() {
        return orderRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable long id) {
        if (orderRepository.existsById(id))
            return new ResponseEntity(orderRepository.findById(id), HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/update")
    public ResponseEntity<Order> updateOrder(@PathVariable long id, @RequestBody Order updatedOrder) {
        if (orderRepository.existsById(id)) {
            Order order = orderRepository.getOne(id);
            order.setOrderDate(LocalDateTime.now());
            order.setTotalPrice(updatedOrder.getTotalPrice());
            orderRepository.save(order);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping // /orders
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        orderRepository.save(order);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
