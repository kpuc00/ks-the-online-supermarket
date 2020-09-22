package com.ks.service.ks.database;

import com.ks.service.ks.model.Order;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends CrudRepository<Order, Long> {}