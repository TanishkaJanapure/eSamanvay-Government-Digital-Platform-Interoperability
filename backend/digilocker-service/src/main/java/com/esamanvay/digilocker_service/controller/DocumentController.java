package com.esamanvay.digilocker_service.controller;

import com.esamanvay.digilocker_service.entity.Document;
import com.esamanvay.digilocker_service.service.DocumentService;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/public/oauth2/1")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping("/files/issued")
    public Map<String, Object> getIssuedDocuments(
            @RequestHeader(value = "Authorization", required = false)
            String authorization) {

        if (authorization == null ||
                !authorization.equals("Bearer MOCK_ACCESS_TOKEN")) {
            throw new RuntimeException("Invalid token");
        }

        String digilockerid = "DL-MOCK-000001";

        List<Document> documents =
                documentService.getIssuedDocuments(digilockerid);

        List<DocumentResponse> responseDocuments = documents.stream()
                .map(document -> new DocumentResponse(
                        document.getUri(),
                        document.getName(),
                        document.getMime(),
                        document.getDoctype(),
                        document.getDescription(),
                        document.getIssuerid(),
                        document.getIssuer()
                ))
                .collect(Collectors.toList());

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("items", responseDocuments);

        return response;
    }
}