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

import javax.transaction.Transactional;
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

    @GetMapping("/processing")
    @PreAuthorize("hasRole('MODERATOR')")
    public List<Order> getAllProcessingOrders() {
        return orderRepository.getAllProcessingOrders();
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

    @PostMapping("/{id}/cancel")
    public ResponseEntity cancelOrder(@PathVariable long id, @RequestBody User user) {
        if (orderRepository.existsById(id)) {
            long userId = user.getId();
            Order order = orderRepository.getOne(id);
            if (order.getUser().getId() == userId) {
                order.setStatus(OrderStatus.CANCELLED);
                orderRepository.save(order);
                return new ResponseEntity<>(HttpStatus.OK);
            } else return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/cart")
    public ResponseEntity<Order> getCart(@RequestBody User user) {
        if (orderRepository.getUserShoppingCart(user.getId()) == null)
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        else {
            Order cart = orderRepository.getUserShoppingCart(user.getId());
            if (cart.getUser().getId().equals(user.getId())) {
                return new ResponseEntity<>(cart, HttpStatus.OK);
            } else return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PutMapping("/cart")
    public ResponseEntity<Order> submitOrder(@RequestBody Order order) {
        if (orderRepository.existsById(order.getOrderId())) {
            order.setOrderDate(LocalDateTime.now());
            order.setStatus(OrderStatus.PROCESSING);
            User user = userRepository.getOne(order.getUser().getId());
            user.setTotalCosts(user.getTotalCosts() + order.getTotalPrice());
            userRepository.save(user);
            orderRepository.save(order);
            return new ResponseEntity<>(HttpStatus.OK);
        } else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/cart/count")
    public ResponseEntity countItemsInCart(@RequestBody User givenUser) {
        if (userRepository.existsById(givenUser.getId())) {
            User user = userRepository.getOne(givenUser.getId());
            Order cart = orderRepository.getUserShoppingCart(user.getId());
            int numCartItems;
            if (cart == null) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                numCartItems = cart.getOrderDetails().size();
                return new ResponseEntity<>(numCartItems, HttpStatus.OK);
            }
        } else return new ResponseEntity(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/cart/clear")
    @Transactional
    public ResponseEntity clearCart(@RequestBody User user) {
        if (orderRepository.existsById(orderRepository.getUserShoppingCart(user.getId()).getOrderId())) {
            Order order = orderRepository.getUserShoppingCart(user.getId());
            if (order.getUser().getId().equals(user.getId())) {
                orderDetailsRepository.deleteAllByOrder_OrderId(order.getOrderId());
                order.setTotalPrice(0);
                orderRepository.save(order);
                return new ResponseEntity<>(HttpStatus.OK);
            } else return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
