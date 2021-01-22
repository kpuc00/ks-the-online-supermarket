package com.ks.service.ks.controller;

import com.ks.service.ks.model.*;
import com.ks.service.ks.security.jwt.JwtUtils;
import com.ks.service.ks.service.OrderDetailsService;
import com.ks.service.ks.service.OrderService;
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
@RequestMapping("/api/orders")
@PreAuthorize("hasRole('USER')")
public class OrderDetailsController {
    @Autowired
    private OrderDetailsService orderDetailsService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtils jwtUtils;

    @GetMapping("/{id}/details")
    public ResponseEntity<List<OrderDetails>> getDetailsOfOrderById(@PathVariable long id, HttpServletRequest request) {
        if (orderService.existsById(id)) {
            String[] token = request.getHeader("Authorization").split(" ");
            User user = userService.getByUsername(jwtUtils.getUserNameFromJwtToken(token[1]));
            Order order = orderService.findById(id).orElse(null);
            assert order != null;
            if (order.getUser().getUsername().equals(user.getUsername()) || isModerator(user)) {
                if (orderDetailsService.getAllByOrder_OrderId(id).size() != 0)
                    return new ResponseEntity<>(orderDetailsService.getAllByOrder_OrderId(id), HttpStatus.OK);
                else return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/addProduct")
    public ResponseEntity<OrderDetails> addProductToCart(@RequestBody OrderDetails orderDetails, HttpServletRequest request) {
        if (userService.existsById(orderDetails.getBuyerId())) {
            String[] token = request.getHeader("Authorization").split(" ");
            User user = userService.getByUsername(jwtUtils.getUserNameFromJwtToken(token[1]));
            User buyer = userService.getOne(orderDetails.getBuyerId());
            Order cart = orderService.getUserShoppingCart(orderDetails.getBuyerId());
            if (cart == null) {
                cart = new Order();
                cart.setUser(buyer);
                orderService.save(cart);
            }
            if (cart.getUser().getUsername().equals(user.getUsername())) {
                orderDetails.setPrice(orderDetails.getProduct().getPrice());
                double amount = Math.round((orderDetails.getPrice() * orderDetails.getQuantity()) * 100.0) / 100.0;
                orderDetails.setAmount(amount);
                orderDetails.setOrder(cart);
                double orderTotalPrice = Math.round((cart.getTotalPrice() + amount) * 100.0) / 100.0;
                cart.setTotalPrice(orderTotalPrice);
                orderService.save(cart);
                orderDetailsService.save(orderDetails);
                return new ResponseEntity<>(orderDetails, HttpStatus.OK);
            } else return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/deleteProduct/{id}")
    public ResponseEntity<Product> deleteProductFromCart(@PathVariable long id, HttpServletRequest request) {
        if (orderDetailsService.existsById(id)) {
            String[] token = request.getHeader("Authorization").split(" ");
            User user = userService.getByUsername(jwtUtils.getUserNameFromJwtToken(token[1]));
            OrderDetails orderDetails = orderDetailsService.getOne(id);
            if (userService.getOne(orderDetails.getBuyerId()).getUsername().equals(user.getUsername())) {
                Order order = orderDetails.getOrder();
                double newOrderTotalPrice = order.getTotalPrice() - orderDetails.getAmount();
                order.setTotalPrice(newOrderTotalPrice);
                orderService.save(order);
                orderDetailsService.deleteById(id);
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    public Boolean isModerator(User user) {
        return user.getRoles().stream().map(Role::getName).anyMatch(ERole.ROLE_MODERATOR::equals);
    }
}
