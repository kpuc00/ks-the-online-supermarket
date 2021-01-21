package com.ks.service.ks.controller;

import com.ks.service.ks.model.ERole;
import com.ks.service.ks.model.Role;
import com.ks.service.ks.model.User;
import com.ks.service.ks.security.jwt.JwtUtils;
import com.ks.service.ks.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtils jwtUtils;

    @GetMapping // /Users
    public @ResponseBody
    List<User> getAllUsers() {
        return userService.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<User> getUserById(@PathVariable long id, HttpServletRequest request) {
        if (userService.existsById(id)) {
            String[] token = request.getHeader("Authorization").split(" ");
            User user = userService.getByUsername(jwtUtils.getUserNameFromJwtToken(token[1]));
            User requestedUser = userService.getOne(id);
            if (requestedUser.getUsername().equals(user.getUsername()) || isAdmin(user)) {
                return new ResponseEntity<>(requestedUser, HttpStatus.OK);
            } else return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PreAuthorize("hasRole('USER')")
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable long id, @RequestBody User updatedUser, HttpServletRequest request) {
        if (userService.existsById(id)) {
            String[] token = request.getHeader("Authorization").split(" ");
            User user = userService.getByUsername(jwtUtils.getUserNameFromJwtToken(token[1]));
            User requestedUser = userService.getOne(id);
            if (requestedUser.getUsername().equals(user.getUsername()) || isAdmin(user)) {
                requestedUser.setFirstName(updatedUser.getFirstName());
                requestedUser.setLastName(updatedUser.getLastName());
                requestedUser.setAddress(updatedUser.getAddress());
                requestedUser.setEmail(updatedUser.getEmail());
                requestedUser.setPhone(updatedUser.getPhone());
                userService.save(requestedUser);
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<User> deleteUser(@PathVariable long id) {
        if (userService.existsById(id)) {
            userService.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    public Boolean isAdmin(User user) {
        return user.getRoles().stream().map(Role::getName).anyMatch(ERole.ROLE_ADMIN::equals);
    }
}
