package com.ks.service.ks.repository;

import com.ks.service.ks.model.OrderDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailsRepository extends JpaRepository<OrderDetails, Long> {
    List<OrderDetails> getAllByOrder_OrderId(Long id);

    void deleteAllByOrder_OrderId(Long id);
}
