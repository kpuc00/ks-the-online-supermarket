package com.ks.service.ks.service;

import com.ks.service.ks.model.Order;

import java.util.List;
import java.util.Optional;

public interface IOrderService {
    Order getUserShoppingCart(Long id);

    List<Order> getAllSubmittedOrdersByUserId(Long id);

    List<Order> getAllProcessingOrders();

    List<Order> getAllNotCollectedOrders();

    List<Order> getAllCollectedOrders();

    Boolean existsById(long id);

    Optional<Order> findById(long id);

    Order save(Order order);

    List<Order> findAll();

    Order getOne(long id);
}
