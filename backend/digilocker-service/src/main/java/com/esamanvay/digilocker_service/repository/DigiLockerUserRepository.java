package com.esamanvay.digilocker_service.repository;

import com.esamanvay.digilocker_service.entity.DigiLockerUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DigiLockerUserRepository
        extends JpaRepository<DigiLockerUser, Long> {

    Optional<DigiLockerUser> findByDigilockerid(String digilockerid);
}