package com.ks.service.ks.repository;

import com.ks.service.ks.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Order getOrderByUser_Id(Long id);

    //Order getOrderByUser_IdAndStatus_Processing(Long id);

    List<Order> getAllByUser_Id(Long id);
}
