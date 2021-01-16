package com.ks.service.ks.repository;

import com.ks.service.ks.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    User getByUsername(String username);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);
}