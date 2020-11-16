package com.ks.service.ks.model;

public enum OrderStatus {
    NOT_CONFIRMED_BY_USER("Order not confirmed"),
    PROCESSING("Processing"),
    READY_TO_GET("Ready to get"),
    ON_THE_GO("On the go"),
    DELIVERED("Delivered"),
    FINISHED("Finished"),
    CANCELLED("Cancelled");

    private final String title;

    OrderStatus(String title) {
        this.title = title;
    }

    @Override
    public String toString() {
        return title;
    }
}
