package com.ks.service.ks.resources;

import com.ks.service.ks.database.CustomerRepository;
import com.ks.service.ks.model.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/customers")
public class CustomerResources {
    @Autowired
    private CustomerRepository customerRepository;

    @PostMapping("/add")
    public ResponseEntity<Customer> createCustomer (@RequestBody Customer customer){
        customerRepository.save(customer);
        return new ResponseEntity<>(customer, HttpStatus.CREATED);
    }

    @GetMapping // /customers
    public @ResponseBody Iterable<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    /*
    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable long id) {
        Customer customer = fakeDb.getCustomer(id);
        if (customer != null)
            return new ResponseEntity<>(fakeDb.getCustomer(id), HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable long id, @RequestBody Customer customer){
        if (fakeDb.editCustomer(id, customer))
            return new ResponseEntity<>(customer, HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Customer> deleteCustomer(@PathVariable long id){
        if (fakeDb.deleteCustomer(id))
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
     */
}
