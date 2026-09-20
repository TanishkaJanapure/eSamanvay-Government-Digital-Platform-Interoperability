package com.esamanvay.education_service.service;

import com.esamanvay.education_service.entity.StudentResult;
import com.esamanvay.education_service.repository.StudentResultRepository;
import org.springframework.stereotype.Service;

@Service
public class StudentResultService {

    private final StudentResultRepository repository;

    public StudentResultService(StudentResultRepository repository) {
        this.repository = repository;
    }

    public StudentResult getBySeatNumber(String seatNumber) {
        return repository.findBySeatNumber(seatNumber)
                .orElse(null);
    }
}