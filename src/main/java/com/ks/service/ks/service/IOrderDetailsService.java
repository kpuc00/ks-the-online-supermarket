package com.ks.service.ks.service;

import com.ks.service.ks.model.OrderDetails;

import java.util.List;

public interface IOrderDetailsService {
    List<OrderDetails> getAllByOrder_OrderId(Long id);

    void deleteAllByOrder_OrderId(Long id);

    void deleteById(long id);

    Boolean existsById(long id);

    OrderDetails save(OrderDetails orderDetails);

    OrderDetails getOne(long id);
}
