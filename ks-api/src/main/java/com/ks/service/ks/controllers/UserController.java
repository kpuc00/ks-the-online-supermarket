package com.ks.service.ks.controllers;

import com.ks.service.ks.model.User;
import com.ks.service.ks.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/add")
    public ResponseEntity<User> createUser (@RequestBody User user){
        userRepository.save(user);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping // /Users
    public @ResponseBody List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable long id) {
        if (userRepository.existsById(id))
            return new ResponseEntity(userRepository.findById(id), HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable long id, @RequestBody User updatedUser){
        if (userRepository.existsById(id)){
            userRepository.findById(id).map(user -> {
                user.setFirstName(updatedUser.getFirstName());
                user.setLastName(updatedUser.getLastName());
                user.setAddress(updatedUser.getAddress());
                user.setEmail(updatedUser.getEmail());
                user.setPhone(updatedUser.getPhone());
                userRepository.save(user);
                return updatedUser;
            });
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<User> deleteUser(@PathVariable long id){
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
