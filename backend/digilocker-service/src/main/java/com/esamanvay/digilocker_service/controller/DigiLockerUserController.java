package com.esamanvay.digilocker_service.controller;

import com.esamanvay.digilocker_service.entity.DigiLockerUser;
import com.esamanvay.digilocker_service.service.DigiLockerUserService;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/public/oauth2/1")
public class DigiLockerUserController {

    private final DigiLockerUserService userService;

    public DigiLockerUserController(DigiLockerUserService userService) {
        this.userService = userService;
    }

    @GetMapping("/user")
    public Map<String, Object> getUser(
            @RequestParam String digilockerId,
            @RequestHeader(
                    value = "Authorization",
                    required = false)
            String authorization) {

        /*
         * -----------------------------------------
         * 1. MOCK AUTHENTICATION
         * -----------------------------------------
         */

        if (authorization == null ||
                !authorization.equals(
                        "Bearer MOCK_ACCESS_TOKEN")) {

            throw new RuntimeException("Invalid token");
        }


        /*
         * -----------------------------------------
         * 2. GET STUDENT BY DIGILOCKER ID
         * -----------------------------------------
         */

        DigiLockerUser user =
                userService.getUserByDigilockerId(
                        digilockerId);


        /*
         * -----------------------------------------
         * 3. BUILD DIGILOCKER RESPONSE
         * -----------------------------------------
         */

        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put(
                "digilockerid",
                user.getDigilockerid());

        response.put(
                "name",
                user.getName());

        response.put(
                "dob",
                user.getDob());

        response.put(
                "gender",
                user.getGender());

        response.put(
                "eaadhaar",
                user.getEaadhaar());

        response.put(
                "reference_key",
                user.getReferenceKey());


        System.out.println(
                "DigiLocker verification: "
                        + user.getDigilockerid()
                        + " -> "
                        + user.getName());


        return response;
    }
}