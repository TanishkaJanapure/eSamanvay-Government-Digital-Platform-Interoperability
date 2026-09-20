package com.esamanvay.digilocker_service.controller;

import com.esamanvay.digilocker_service.entity.Document;
import com.esamanvay.digilocker_service.service.DocumentService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/public/oauth2/1")
public class FileController {

    private final DocumentService documentService;

    public FileController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping("/file/uri")
    public ResponseEntity<byte[]> getFileByUri(
            @RequestParam String uri,
            @RequestHeader(value = "Authorization", required = false)
            String authorization) {

        if (authorization == null ||
                !authorization.equals("Bearer MOCK_ACCESS_TOKEN")) {
            throw new RuntimeException("Invalid token");
        }

        Document document = documentService.getDocumentByUri(uri);

        byte[] pdfBytes = createMockPdf(document);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentLength(pdfBytes.length);
        headers.setContentDispositionFormData(
                "attachment",
                document.getName() + ".pdf"
        );

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }

    private byte[] createMockPdf(Document document) {

        String text =
                "eSamanvay - DigiLocker Mock Document\n" +
                "-----------------------------------\n" +
                "Document: " + document.getName() + "\n" +
                "Document Type: " + document.getDoctype() + "\n" +
                "Issuer: " + document.getIssuer() + "\n" +
                "URI: " + document.getUri() + "\n";

        String escapedText = text
                .replace("\\", "\\\\")
                .replace("(", "\\(")
                .replace(")", "\\)")
                .replace("\n", ") Tj\n0 -20 Td\n(");

        String pdf =
                "%PDF-1.4\n" +
                "1 0 obj\n" +
                "<< /Type /Catalog /Pages 2 0 R >>\n" +
                "endobj\n" +

                "2 0 obj\n" +
                "<< /Type /Pages /Kids [3 0 R] /Count 1 >>\n" +
                "endobj\n" +

                "3 0 obj\n" +
                "<< /Type /Page /Parent 2 0 R " +
                "/MediaBox [0 0 612 792] " +
                "/Resources << /Font << /F1 4 0 R >> >> " +
                "/Contents 5 0 R >>\n" +
                "endobj\n" +

                "4 0 obj\n" +
                "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\n" +
                "endobj\n" +

                "5 0 obj\n" +
                "<< /Length " + (escapedText.length() + 50) + " >>\n" +
                "stream\n" +
                "BT\n" +
                "/F1 12 Tf\n" +
                "50 750 Td\n" +
                "(" + escapedText + ") Tj\n" +
                "ET\n" +
                "endstream\n" +
                "endobj\n" +

                "xref\n" +
                "0 6\n" +
                "0000000000 65535 f \n" +
                "0000000009 00000 n \n" +
                "0000000058 00000 n \n" +
                "0000000115 00000 n \n" +
                "0000000275 00000 n \n" +
                "0000000345 00000 n \n" +
                "trailer\n" +
                "<< /Size 6 /Root 1 0 R >>\n" +
                "startxref\n" +
                "500\n" +
                "%%EOF";

        return pdf.getBytes(StandardCharsets.ISO_8859_1);
    }
}