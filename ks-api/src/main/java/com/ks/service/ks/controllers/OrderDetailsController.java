package com.ks.service.ks.controllers;

import com.ks.service.ks.model.Order;
import com.ks.service.ks.model.OrderDetails;
import com.ks.service.ks.repository.OrderDetailsRepository;
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
public class OrderDetailsController {
    @Autowired
    private OrderDetailsRepository orderDetailsRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderController orderController;

    @GetMapping("/allOrderDetails")
    public @ResponseBody
    List<OrderDetails> getAllOrderDetails() {
        return orderDetailsRepository.findAll();
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<OrderDetails> getDetailsOfOrderById(@PathVariable long id) {
        if (orderRepository.existsById(id)) {
            if (orderDetailsRepository.getOrderDetailsByOrder_OrderId(id).size() != 0)
                return new ResponseEntity(orderDetailsRepository.getOrderDetailsByOrder_OrderId(id), HttpStatus.OK);
            else return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/addProduct")
    public ResponseEntity<OrderDetails> addProductToOrder(@RequestBody OrderDetails orderDetails) {
        if (orderDetails.getOrder() == null) {
            Order order = new Order();
            order.setUser(orderDetails.getBuyer());
            orderController.createOrder(order);
        }
        orderDetails.setOrder(orderRepository.getOrderByUser_Id(orderDetails.getBuyer().getId()));
        double amount = orderDetails.getPrice() * orderDetails.getQuantity();
        orderDetails.setAmount(amount);
        orderDetailsRepository.save(orderDetails);
        return new ResponseEntity<>(orderDetails, HttpStatus.OK);
    }
}
