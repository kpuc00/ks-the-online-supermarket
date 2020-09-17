package com.ks.service.ks.resources;

import com.ks.service.ks.database.FakeDatabase;
import com.ks.service.ks.model.Customer;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customers")
public class CustomerResources {
    private static final FakeDatabase fakeDb = new FakeDatabase();

    @PostMapping("/add")
    public ResponseEntity<Customer> createCustomer (@RequestBody Customer customer){
        if(fakeDb.addCustomer(customer))
            return new ResponseEntity<>(customer, HttpStatus.CREATED);
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @GetMapping // /customers
    public ResponseEntity<List<Customer>> getAllCustomers() {
        if (fakeDb.getAllCustomers() != null)
            return new ResponseEntity<>(fakeDb.getAllCustomers(), HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

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
}
