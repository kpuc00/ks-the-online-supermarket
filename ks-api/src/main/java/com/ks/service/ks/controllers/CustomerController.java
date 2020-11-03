package com.ks.service.ks.controllers;

import com.ks.service.ks.repository.CustomerRepository;
import com.ks.service.ks.model.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/customers")
public class CustomerController {
    @Autowired
    private CustomerRepository customerRepository;

    @PostMapping("/add")
    public ResponseEntity<Customer> createCustomer (@RequestBody Customer customer){
        customerRepository.save(customer);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping // /customers
    public @ResponseBody Iterable<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable long id) {
        if (customerRepository.existsById(id))
            return new ResponseEntity(customerRepository.findById(id), HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable long id, @RequestBody Customer updatedCustomer){
        if (customerRepository.existsById(id)){
            customerRepository.findById(id).map(customer -> {
                customer.setName(updatedCustomer.getName());
                customer.setAddress(updatedCustomer.getAddress());
                customer.setEmail(updatedCustomer.getEmail());
                customer.setPhone(updatedCustomer.getPhone());
                customerRepository.save(customer);
                return updatedCustomer;
            });
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Customer> deleteCustomer(@PathVariable long id){
        if (customerRepository.existsById(id)) {
            customerRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
