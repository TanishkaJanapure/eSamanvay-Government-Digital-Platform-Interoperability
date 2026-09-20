package com.esamanvay.revenue_service.controller;

import com.esamanvay.revenue_service.entity.IncomeCertificate;
import com.esamanvay.revenue_service.service.IncomeCertificateService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/revenue")
public class IncomeCertificateController {

    private final IncomeCertificateService service;

    public IncomeCertificateController(
            IncomeCertificateService service) {

        this.service = service;
    }

    @GetMapping("/income-certificate/{certificateNumber}")
    public IncomeCertificateResponse getCertificate(
            @PathVariable String certificateNumber) {

        IncomeCertificate certificate =
                service.getByCertificateNumber(certificateNumber);

        return new IncomeCertificateResponse(
                certificate.getCertificateNumber(),
                certificate.getApplicantName(),
                certificate.getFinancialYear(),
                certificate.getAnnualIncome(),
                certificate.getDistrict(),
                certificate.getStatus()
        );
    }

    @GetMapping("/income-certificate/verify/{certificateNumber}")
    public IncomeCertificateResponse verifyCertificate(
            @PathVariable String certificateNumber) {

        IncomeCertificate certificate =
                service.getByCertificateNumber(certificateNumber);

        return new IncomeCertificateResponse(
                certificate.getCertificateNumber(),
                certificate.getApplicantName(),
                certificate.getFinancialYear(),
                certificate.getAnnualIncome(),
                certificate.getDistrict(),
                certificate.getStatus()
        );
    }
}