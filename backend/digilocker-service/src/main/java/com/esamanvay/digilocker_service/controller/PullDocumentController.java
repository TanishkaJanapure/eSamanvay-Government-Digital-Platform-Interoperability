package com.esamanvay.digilocker_service.controller;

import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/public/oauth2/1")
public class PullDocumentController {

    @PostMapping("/pull")
    public Map<String, String> pullDocument(
            @RequestHeader(value = "Authorization", required = false)
            String authorization,
            @RequestBody Map<String, String> request) {

        if (authorization == null ||
                !authorization.equals("Bearer MOCK_ACCESS_TOKEN")) {
            throw new RuntimeException("Invalid token");
        }

        String uri = request.get("uri");

        if (uri == null || uri.isBlank()) {
            throw new RuntimeException("URI is required");
        }

        Map<String, String> response = new LinkedHashMap<>();
        response.put("uri", uri);

        return response;
    }
}