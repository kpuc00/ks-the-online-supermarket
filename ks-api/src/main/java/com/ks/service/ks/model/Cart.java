package com.ks.service.ks.model;

import java.util.Collection;

public class Cart {
    private Long cartId;
    private Collection<Product> products;
    private Long userId;
    private double totalCosts;
}
