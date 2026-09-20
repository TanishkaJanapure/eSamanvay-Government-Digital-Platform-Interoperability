package com.esamanvay.digilocker_service.controller;

import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/public/oauth2/1")
public class TokenController {

    @PostMapping("/token")
    public Map<String, Object> getAccessToken(
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String grant_type,
            @RequestParam(required = false) String client_id,
            @RequestParam(required = false) String client_secret,
            @RequestParam(required = false) String redirect_uri,
            @RequestParam(required = false) String code_verifier) {

        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put(
                "access_token",
                "MOCK_ACCESS_TOKEN");

        response.put(
                "expires_in",
                3600);

        response.put(
                "token_type",
                "Bearer");

        response.put(
                "scope",
                "openid");

        return response;
    }
}