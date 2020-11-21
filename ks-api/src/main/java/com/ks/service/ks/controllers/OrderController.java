package com.ks.service.ks.controllers;

import com.ks.service.ks.model.Order;
import com.ks.service.ks.model.OrderStatus;
import com.ks.service.ks.model.User;
import com.ks.service.ks.repository.OrderDetailsRepository;
import com.ks.service.ks.repository.OrderRepository;
import com.ks.service.ks.repository.UserRepository;
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

    @Autowired
    private OrderDetailsRepository orderDetailsRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        orderRepository.save(order);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable long id) {
        if (orderRepository.existsById(id))
            if (orderRepository.findById(id).isPresent())
                return new ResponseEntity(orderRepository.findById(id), HttpStatus.OK);
            else return new ResponseEntity(HttpStatus.FORBIDDEN);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/user")
    public @ResponseBody
    ResponseEntity<List<Order>> getAllSubmittedOrdersByUser(@RequestBody User user) {
        List<Order> orders = orderRepository.getAllSubmittedOrdersByUserId(user.getId());
        if (orders.isEmpty())
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        else return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @PostMapping("/cart")
    public ResponseEntity<Order> getCart(@RequestBody User user) {
        Order cart = orderRepository.getUserShoppingCart(user.getId());
        if (cart != null)
            return new ResponseEntity<Order>(cart, HttpStatus.OK);
        else return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/cart")
    public ResponseEntity<Order> submitOrder(@RequestBody Order order) {
        if (orderRepository.existsById(order.getOrderId())) {
            order.setOrderDate(LocalDateTime.now());
            order.setStatus(OrderStatus.PROCESSING);
            User user = userRepository.findById(order.getUser().getId()).get();
            user.setTotalCosts(user.getTotalCosts() + order.getTotalPrice());
            userRepository.save(user);
            orderRepository.save(order);
            return new ResponseEntity<>(HttpStatus.OK);
        } else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/cart/count")
    public ResponseEntity countItemsInCart(@RequestBody User givenUser) {
        User user = userRepository.findById(givenUser.getId()).get();
        Order cart = orderRepository.getUserShoppingCart(user.getId());
        int numCartItems;
        if (cart != null) {
            numCartItems = cart.getOrderDetails().size();
            return new ResponseEntity<>(numCartItems, HttpStatus.OK);
        } else return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/cart/{id}")
    public ResponseEntity clearCart(@PathVariable long id) {
        System.out.println(id);
        if (orderRepository.existsById(id)) {
            orderDetailsRepository.deleteOrderDetailsByOrder_OrderId(id);
            Order order = orderRepository.findById(id).get();
            order.setTotalPrice(0);
            orderRepository.save(order);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
