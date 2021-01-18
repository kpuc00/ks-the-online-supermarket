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
import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/orders")
@PreAuthorize("hasRole('USER')")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderDetailsService orderDetailsService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtils jwtUtils;

    @GetMapping("/processing")
    @PreAuthorize("hasRole('MODERATOR')")
    public List<Order> getAllProcessingOrders() {
        return orderService.getAllProcessingOrders();
    }

    @GetMapping("/unreceived")
    @PreAuthorize("hasRole('MODERATOR')")
    public List<Order> getNotCollectedOrders() {
        return orderService.getAllNotCollectedOrders();
    }

    @GetMapping("/received")
    @PreAuthorize("hasRole('MODERATOR')")
    public List<Order> getCollectedOrders() {
        return orderService.getAllCollectedOrders();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable long id, HttpServletRequest request) {
        if (orderService.existsById(id)) {
            String[] token = request.getHeader("Authorization").split(" ");
            User user = userService.getByUsername(jwtUtils.getUserNameFromJwtToken(token[1]));
            Order order = orderService.findById(id).orElse(null);
            assert order != null;
            if (order.getUser().getUsername().equals(user.getUsername()) || isModerator(user))
                return new ResponseEntity<>(order, HttpStatus.OK);
            else return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/delivery/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<Order> getOrderByIdForDelivery(@PathVariable long id) {
        if (orderService.existsById(id))
            if (orderService.findById(id).isPresent())
                return new ResponseEntity(orderService.findById(id), HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/send/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public HttpStatus sendOrder(@PathVariable long id, @RequestBody Order givenOrderInfo) {
        if (orderService.existsById(id)) {
            Order order = orderService.getOne(id);
            order.setStatus(givenOrderInfo.getStatus());
            orderService.save(order);
            return HttpStatus.OK;
        } else return HttpStatus.NOT_FOUND;
    }

    @PostMapping("/deliver/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public HttpStatus deliverOrder(@PathVariable long id, @RequestBody Order givenOrderInfo) {
        if (orderService.existsById(id)) {
            Order order = orderService.getOne(id);
            order.setStatus(givenOrderInfo.getStatus());
            order.setDeliveredDate(LocalDateTime.now());
            orderService.save(order);
            return HttpStatus.OK;
        } else return HttpStatus.NOT_FOUND;
    }

    @PostMapping("/user")
    public @ResponseBody
    ResponseEntity<List<Order>> getAllSubmittedOrdersByUser(@RequestBody User givenUser, HttpServletRequest request) {
        if (userService.existsById(givenUser.getId())) {
            String[] token = request.getHeader("Authorization").split(" ");
            User userToken = userService.getByUsername(jwtUtils.getUserNameFromJwtToken(token[1]));
            User user = userService.findById(givenUser.getId()).orElse(null);
            assert user != null;
            if (user.getUsername().equals(userToken.getUsername()) || isModerator(userToken)) {
                List<Order> orders = orderService.getAllSubmittedOrdersByUserId(givenUser.getId());
                if (orders.isEmpty())
                    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
                else return new ResponseEntity<>(orders, HttpStatus.OK);
            } else return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/{id}/cancel")
    public HttpStatus cancelOrder(@PathVariable long id, @RequestBody User givenUser, HttpServletRequest request) {
        if (orderService.existsById(id)) {
            String[] token = request.getHeader("Authorization").split(" ");
            User userToken = userService.getByUsername(jwtUtils.getUserNameFromJwtToken(token[1]));
            Order order = orderService.getOne(id);
            if (order.getUser().getUsername().equals(userToken.getUsername())) {
                order.setStatus(OrderStatus.CANCELLED);
                orderService.save(order);
                return HttpStatus.OK;
            } else return HttpStatus.FORBIDDEN;
        } else return HttpStatus.NOT_FOUND;
    }

    @PostMapping("/cart")
    public ResponseEntity<Order> getCart(@RequestBody User givenUser, HttpServletRequest request) {
        String[] token = request.getHeader("Authorization").split(" ");
        User userToken = userService.getByUsername(jwtUtils.getUserNameFromJwtToken(token[1]));
        User user = userService.findById(givenUser.getId()).orElse(null);
        assert user != null;
        if (user.getUsername().equals(userToken.getUsername())) {
            if (orderService.getUserShoppingCart(givenUser.getId()) == null)
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            else {
                Order cart = orderService.getUserShoppingCart(givenUser.getId());
                return new ResponseEntity<>(cart, HttpStatus.OK);
            }
        } else return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }

    @PutMapping("/cart")
    public HttpStatus submitOrder(@RequestBody Order order, HttpServletRequest request) {
        if (orderService.existsById(order.getOrderId())) {
            String[] token = request.getHeader("Authorization").split(" ");
            User userToken = userService.getByUsername(jwtUtils.getUserNameFromJwtToken(token[1]));
            User user = userService.getOne(order.getUser().getId());
            if (user.getUsername().equals(userToken.getUsername())) {
                order.setOrderDate(LocalDateTime.now());
                order.setStatus(OrderStatus.PROCESSING);
                user.setTotalCosts(user.getTotalCosts() + order.getTotalPrice());
                userService.save(user);
                orderService.save(order);
                return HttpStatus.OK;
            } else return HttpStatus.FORBIDDEN;
        } else return HttpStatus.NOT_FOUND;
    }

    @PostMapping("/cart/count")
    public ResponseEntity countItemsInCart(@RequestBody User givenUser, HttpServletRequest request) {
        if (userService.existsById(givenUser.getId())) {
            String[] token = request.getHeader("Authorization").split(" ");
            User userToken = userService.getByUsername(jwtUtils.getUserNameFromJwtToken(token[1]));
            User user = userService.getOne(givenUser.getId());
            if (user.getUsername().equals(userToken.getUsername())) {
                Order cart = orderService.getUserShoppingCart(user.getId());
                int numCartItems;
                if (cart == null) {
                    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
                } else {
                    numCartItems = cart.getOrderDetails().size();
                    return new ResponseEntity<>(numCartItems, HttpStatus.OK);
                }
            } else return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/cart/clear")
    @Transactional
    public ResponseEntity clearCart(@RequestBody User givenUser, HttpServletRequest request) {
        if (orderService.existsById(orderService.getUserShoppingCart(givenUser.getId()).getOrderId())) {
            String[] token = request.getHeader("Authorization").split(" ");
            User userToken = userService.getByUsername(jwtUtils.getUserNameFromJwtToken(token[1]));
            User user = userService.getOne(givenUser.getId());
            if (user.getUsername().equals(userToken.getUsername())) {
                Order order = orderService.getUserShoppingCart(givenUser.getId());
                orderDetailsService.deleteAllByOrder_OrderId(order.getOrderId());
                order.setTotalPrice(0);
                orderService.save(order);
                return new ResponseEntity<>(HttpStatus.OK);
            } else return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } else return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    public Boolean isModerator(User user) {
        return user.getRoles().stream().map(Role::getName).anyMatch(ERole.ROLE_MODERATOR::equals);
    }
}
