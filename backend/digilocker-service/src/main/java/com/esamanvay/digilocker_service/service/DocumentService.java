package com.esamanvay.digilocker_service.service;

import com.esamanvay.digilocker_service.entity.Document;
import com.esamanvay.digilocker_service.repository.DocumentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DocumentService {

    private final DocumentRepository repository;

    public DocumentService(DocumentRepository repository) {
        this.repository = repository;
    }

    public List<Document> getIssuedDocuments(String digilockerid) {
        return repository.findByDigilockerid(digilockerid);
    }

    public Document getDocumentByUri(String uri) {
        return repository.findByUri(uri)
                .orElseThrow(() -> new RuntimeException("Document not found"));
    }
}