package com.esamanvay.revenue_service.service;

import com.esamanvay.revenue_service.entity.IncomeCertificate;
import com.esamanvay.revenue_service.repository.IncomeCertificateRepository;
import org.springframework.stereotype.Service;

@Service
public class IncomeCertificateService {

    private final IncomeCertificateRepository repository;

    public IncomeCertificateService(
            IncomeCertificateRepository repository) {
        this.repository = repository;
    }

    public IncomeCertificate getByCertificateNumber(
            String certificateNumber) {

        return repository.findByCertificateNumber(certificateNumber)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Income certificate not found"));
    }

    public IncomeCertificate getByAadhaarNumber(
            String aadhaarNumber) {

        return repository.findByAadhaarNumber(aadhaarNumber)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Income certificate not found"));
    }

    public IncomeCertificate save(
            IncomeCertificate certificate) {

        return repository.save(certificate);
    }
}