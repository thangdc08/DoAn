package com.badminton.identityservice.config;

import com.badminton.identityservice.entity.Role;
import com.badminton.identityservice.entity.User;
import com.badminton.identityservice.entity.UserStatus;
import com.badminton.identityservice.repository.RoleRepository;
import com.badminton.identityservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        log.info("🌱 Checking roles and seeder data...");

        // Ensure roles exist
        Role adminRole = getOrCreateRole("ADMIN", "System Administrator");
        getOrCreateRole("USER", "Regular User");
        getOrCreateRole("OWNER", "Venue Owner");

        // Seed default Admin: admin@badmintonhub.local / admin123
        String adminEmail = "admin@badmintonhub.local";
        User admin = userRepository.findByEmail(adminEmail).orElse(null);
        if (admin == null) {
            log.info("🌱 Seeding default administrator account: {}", adminEmail);
            admin = User.builder()
                    .email(adminEmail)
                    .phone("0999999999")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .fullName("SmashMate Admin")
                    .status(UserStatus.ACTIVE)
                    .roles(new HashSet<>(Set.of(adminRole)))
                    .build();
            userRepository.save(admin);
            log.info("✅ Administrator account seeded successfully!");
        } else {
            log.info("✨ Administrator account already exists. Resetting password to admin123 and role to ADMIN...");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setRoles(new HashSet<>(Set.of(adminRole)));
            userRepository.save(admin);
            log.info("✅ Administrator credentials verified and updated successfully!");
        }
    }

    private Role getOrCreateRole(String code, String name) {
        return roleRepository.findByCode(code).orElseGet(() -> {
            log.info("🌱 Creating role: {}", code);
            Role role = Role.builder()
                    .code(code)
                    .name(name)
                    .build();
            return roleRepository.save(role);
        });
    }
}
