package com.ks.service.ks.resources;

import com.ks.service.ks.database.FakeDatabase;
import com.ks.service.ks.model.Order;
import com.ks.service.ks.model.OrderStatus;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderResources {
    private static final FakeDatabase fakeDb = new FakeDatabase();

    @PostMapping("/add")
    public ResponseEntity<Order> createOrder (@RequestBody Order order){
        if(fakeDb.addOrder(order))
            return new ResponseEntity<>(order, HttpStatus.CREATED);
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @GetMapping // /orders
    public ResponseEntity<List<Order>> getAllOrders() {
        if (fakeDb.getAllOrders() != null)
            return new ResponseEntity<>(fakeDb.getAllOrders(), HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable long id) {
        Order order = fakeDb.getOrder(id);
        if (order != null)
            return new ResponseEntity<>(fakeDb.getOrder(id), HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable long id, @RequestBody OrderStatus status){
        if (fakeDb.editOrderStatus(id, status))
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Order> deleteOrder(@PathVariable long id){
        if (fakeDb.deleteOrder(id))
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
