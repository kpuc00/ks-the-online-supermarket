package com.ks.service.ks.service;

import com.ks.service.ks.model.User;

import java.util.List;
import java.util.Optional;

public interface IUserService {
    Optional<User> findByUsername(String username);

    Boolean existsByUsername(String username);

    User getByUsername(String username);

    Boolean existsByEmail(String email);

    void deleteById(long id);

    Boolean existsById(long id);

    Optional<User> findById(long id);

    User save(User user);

    List<User> findAll();

    User getOne(long id);
}
