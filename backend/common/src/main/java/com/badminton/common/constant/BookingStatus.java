package com.badminton.common.constant;

import lombok.Getter;

@Getter
public enum BookingStatus {
    PENDING("PENDING"),
    CONFIRMED("CONFIRMED"),
    PAID("PAID"),
    COMPLETED("COMPLETED"),
    CANCELLED("CANCELLED"),
    REFUNDED("REFUNDED");

    private final String value;

    BookingStatus(String value) {
        this.value = value;
    }
}
