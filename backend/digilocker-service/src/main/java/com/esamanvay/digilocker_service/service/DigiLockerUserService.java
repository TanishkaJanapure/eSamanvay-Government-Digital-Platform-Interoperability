package com.esamanvay.digilocker_service.service;

import com.esamanvay.digilocker_service.entity.DigiLockerUser;
import com.esamanvay.digilocker_service.repository.DigiLockerUserRepository;
import org.springframework.stereotype.Service;

@Service
public class DigiLockerUserService {

    private final DigiLockerUserRepository repository;

    public DigiLockerUserService(
            DigiLockerUserRepository repository) {

        this.repository = repository;
    }

    /*
     * Get DigiLocker user using DigiLocker ID
     *
     * Example:
     * DL001 -> Tanishka Janapure
     * DL002 -> Priti Shinde
     * DL003 -> Pranav Ghatage
     */
    public DigiLockerUser getUserByDigilockerId(
            String digilockerId) {

        return repository
                .findByDigilockerid(digilockerId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "DigiLocker user not found: "
                                        + digilockerId));
    }

    /*
     * Keep the old method also so existing
     * controllers/services don't break.
     */
    public DigiLockerUser getUser() {

        return repository.findAll()
                .stream()
                .findFirst()
                .orElseThrow(() ->
                        new RuntimeException(
                                "DigiLocker user not found"));
    }
}