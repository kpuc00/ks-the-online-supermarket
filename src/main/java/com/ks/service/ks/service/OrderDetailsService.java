package com.ks.service.ks.service;

import com.ks.service.ks.model.OrderDetails;
import com.ks.service.ks.repository.OrderDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderDetailsService implements IOrderDetailsService {
    @Autowired
    private OrderDetailsRepository orderDetailsRepository;

    @Override
    public List<OrderDetails> getAllByOrder_OrderId(Long id) {
        return orderDetailsRepository.getAllByOrder_OrderId(id);
    }

    @Override
    public void deleteAllByOrder_OrderId(Long id) {
        orderDetailsRepository.deleteAllByOrder_OrderId(id);
    }

    @Override
    public void deleteById(long id) {
        orderDetailsRepository.deleteById(id);
    }

    @Override
    public Boolean existsById(long id) {
        return orderDetailsRepository.existsById(id);
    }

    @Override
    public OrderDetails save(OrderDetails orderDetails) {
        return orderDetailsRepository.save(orderDetails);
    }

    @Override
    public OrderDetails getOne(long id) {
        return orderDetailsRepository.getOne(id);
    }
}
