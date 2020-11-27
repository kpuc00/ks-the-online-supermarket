package com.ks.service.ks.service;

import com.ks.service.ks.model.Order;
import com.ks.service.ks.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService implements IOrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Override
    public Order getUserShoppingCart(Long id) {
        return orderRepository.getUserShoppingCart(id);
    }

    @Override
    public List<Order> getAllSubmittedOrdersByUserId(Long id) {
        return orderRepository.getAllSubmittedOrdersByUserId(id);
    }

    @Override
    public List<Order> getAllProcessingOrders() {
        return orderRepository.getAllProcessingOrders();
    }

    @Override
    public Boolean existsById(long id) {
        return orderRepository.existsById(id);
    }

    @Override
    public Optional<Order> findById(long id) {
        return orderRepository.findById(id);
    }

    @Override
    public Order save(Order order) {
        return orderRepository.save(order);
    }

    @Override
    public List<Order> findAll() {
        return orderRepository.findAll();
    }

    @Override
    public Order getOne(long id) {
        return orderRepository.getOne(id);
    }
}
