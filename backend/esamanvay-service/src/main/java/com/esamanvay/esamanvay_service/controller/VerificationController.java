package com.esamanvay.esamanvay_service.controller;

import com.esamanvay.esamanvay_service.dto.VerificationRequest;
import com.esamanvay.esamanvay_service.dto.VerificationResponse;
import com.esamanvay.esamanvay_service.service.VerificationService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/esamanvay")
@CrossOrigin(origins = "*")
public class VerificationController {

    private final VerificationService service;

    public VerificationController(
            VerificationService service) {

        this.service = service;
    }

    @PostMapping("/verify")
    public VerificationResponse verify(
            @RequestBody VerificationRequest request) {

        return service.verifyStudent(request);
    }
}