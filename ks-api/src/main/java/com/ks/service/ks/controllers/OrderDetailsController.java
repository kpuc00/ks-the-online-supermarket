package com.ks.service.ks.controllers;

import com.ks.service.ks.model.Order;
import com.ks.service.ks.model.OrderDetails;
import com.ks.service.ks.model.Product;
import com.ks.service.ks.model.User;
import com.ks.service.ks.repository.OrderDetailsRepository;
import com.ks.service.ks.repository.OrderRepository;
import com.ks.service.ks.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/orders")
@PreAuthorize("hasRole('USER')")
public class OrderDetailsController {
    @Autowired
    private OrderDetailsRepository orderDetailsRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{id}/details")
    public ResponseEntity<OrderDetails> getDetailsOfOrderById(@PathVariable long id) {
        if (orderRepository.existsById(id)) {
            if (orderDetailsRepository.getAllByOrder_OrderId(id).size() != 0)
                return new ResponseEntity(orderDetailsRepository.getAllByOrder_OrderId(id), HttpStatus.OK);
            else return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/addProduct")
    public ResponseEntity<OrderDetails> addProductToCart(@RequestBody OrderDetails orderDetails) {
        if (userRepository.existsById(orderDetails.getBuyerId())) {
            User buyer = userRepository.getOne(orderDetails.getBuyerId());
            Order cart = orderRepository.getUserShoppingCart(orderDetails.getBuyerId());
            if (cart == null) {
                cart = new Order();
                cart.setUser(buyer);
                orderRepository.save(cart);
            }
            orderDetails.setPrice(orderDetails.getProduct().getPrice());
            double amount = Math.round((orderDetails.getPrice() * orderDetails.getQuantity()) * 100.0) / 100.0;
            orderDetails.setAmount(amount);
            orderDetails.setOrder(cart);
            double orderTotalPrice = Math.round((cart.getTotalPrice() + amount) * 100.0) / 100.0;
            cart.setTotalPrice(orderTotalPrice);
            orderRepository.save(cart);
            orderDetailsRepository.save(orderDetails);
            return new ResponseEntity<>(orderDetails, HttpStatus.OK);
        } else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/deleteProduct/{id}")
    public ResponseEntity<Product> deleteProduct(@PathVariable long id) {
        if (orderDetailsRepository.existsById(id)) {
            OrderDetails orderDetails = orderDetailsRepository.getOne(id);
            Order order = orderDetails.getOrder();
            double newOrderTotalPrice = order.getTotalPrice() - orderDetails.getAmount();
            order.setTotalPrice(newOrderTotalPrice);
            orderRepository.save(order);
            orderDetailsRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
