package com.badminton.identityservice.repository;

import com.badminton.identityservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID>, JpaSpecificationExecutor<User> {
    
    boolean existsByEmail(String email);
    
    boolean existsByPhone(String phone);

    Optional<User> findByEmail(String email);

    Optional<User> findByPhone(String phone);

    @Query("SELECT u FROM User u WHERE u.email = :login OR u.phone = :login")
    Optional<User> findByEmailOrPhone(String login);

    @Query("SELECT u FROM User u JOIN FETCH u.roles WHERE u.email = :login OR u.phone = :login")
    Optional<User> findByEmailOrPhoneWithRoles(String login);
}
