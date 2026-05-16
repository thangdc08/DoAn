package com.badminton.common.constant;

import lombok.Getter;

@Getter
public enum VenueStatus {
    PENDING_APPROVAL("Chờ duyệt"),
    APPROVED("Đang hoạt động"),
    REJECTED("Bị từ chối"),
    SUSPENDED("Tạm dừng");

    private final String displayName;

    VenueStatus(String displayName) {
        this.displayName = displayName;
    }
}
