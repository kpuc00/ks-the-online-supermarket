package com.ks.service.ks.service;

import com.ks.service.ks.model.ERole;
import com.ks.service.ks.model.Role;

import java.util.Optional;

public interface IRoleService {
    Optional<Role> findByName(ERole name);
}
