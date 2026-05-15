package com.badminton.common.constant;

import lombok.Getter;

@Getter
public enum VenueStatus {
    PENDING_APPROVAL("PENDING_APPROVAL"),
    ACTIVE("ACTIVE"),
    INACTIVE("INACTIVE"),
    CLOSED("CLOSED");

    private final String value;

    VenueStatus(String value) {
        this.value = value;
    }
}
