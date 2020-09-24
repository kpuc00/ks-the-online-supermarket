package com.ks.service.ks.resources;

import com.ks.service.ks.database.OrderRepository;
import com.ks.service.ks.model.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
public class OrderResources {
    @Autowired
    private OrderRepository orderRepository;

    @PostMapping("/add")
    public ResponseEntity<Order> createOrder (@RequestBody Order order){
        orderRepository.save(order);
        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }

    @GetMapping // /orders
    public @ResponseBody Iterable<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable long id) {
        if (orderRepository.existsById(id))
            return new ResponseEntity(orderRepository.findById(id), HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable long id, @RequestBody Order updatedOrderStatus){
        if (orderRepository.existsById(id)){
            orderRepository.findById(id).map(order -> {
                order.setStatus(updatedOrderStatus.getStatus());
                orderRepository.save(order);
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            });
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Order> deleteOrder(@PathVariable long id){
        if (orderRepository.existsById(id)) {
            orderRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
