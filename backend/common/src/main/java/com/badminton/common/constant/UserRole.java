package com.badminton.common.constant;

import lombok.Getter;

@Getter
public enum UserRole {
    ADMIN("ADMIN"),
    OWNER("OWNER"),
    USER("USER");

    private final String value;

    UserRole(String value) {
        this.value = value;
    }

    public String getAuthority() {
        return "SCOPE_" + value;
    }
}
