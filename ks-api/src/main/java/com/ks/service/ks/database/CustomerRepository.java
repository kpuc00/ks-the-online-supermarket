package com.ks.service.ks.database;

import com.ks.service.ks.model.Customer;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

// This will be AUTO IMPLEMENTED by Spring into a Bean called customerRepository
@Repository
public interface CustomerRepository extends CrudRepository<Customer, Long> {}
