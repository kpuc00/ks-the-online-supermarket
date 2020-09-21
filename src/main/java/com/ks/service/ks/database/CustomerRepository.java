package com.ks.service.ks.database;

import com.ks.service.ks.model.Customer;
import org.springframework.data.repository.CrudRepository;

// This will be AUTO IMPLEMENTED by Spring into a Bean called customerRepository
public interface CustomerRepository extends CrudRepository<Customer, Integer> {}
