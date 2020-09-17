package com.ks.service.ks.resources;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class HelloController {
    @RequestMapping
    public String index() {
        return "Greetings from Spring Boot!";
    }

    @GetMapping("hello")
    public String show() {
        return "Hello world!";
    }
}
