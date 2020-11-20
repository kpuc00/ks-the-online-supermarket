package com.ks.service.ks.repository;

import com.ks.service.ks.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query(value = "SELECT * FROM ORDERS WHERE user_id = ?1 AND status = 'NOT_CONFIRMED_BY_USER'", nativeQuery = true)
    Order getUserShoppingCart(Long id);

    List<Order> getAllByUser_Id(Long id);
}
