package com.badminton.communityservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = "com.badminton")
@EnableScheduling
public class CommunityApplication {
    public static void main(String[] args) {
        SpringApplication.run(CommunityApplication.class, args);
    }
}
