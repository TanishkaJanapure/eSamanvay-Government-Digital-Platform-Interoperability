package com.esamanvay.revenue_service.repository;

import com.esamanvay.revenue_service.entity.IncomeCertificate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IncomeCertificateRepository
        extends JpaRepository<IncomeCertificate, Long> {

    Optional<IncomeCertificate> findByCertificateNumber(
            String certificateNumber
    );

    Optional<IncomeCertificate> findByAadhaarNumber(
            String aadhaarNumber
    );
}