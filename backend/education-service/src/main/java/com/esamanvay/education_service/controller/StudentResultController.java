package com.esamanvay.education_service.controller;

import com.esamanvay.education_service.entity.StudentResult;
import com.esamanvay.education_service.service.StudentResultService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/education")
public class StudentResultController {

    private final StudentResultService service;

    public StudentResultController(StudentResultService service) {
        this.service = service;
    }

    @GetMapping("/result/{seatNumber}")
    public ResponseEntity<?> getResult(
            @PathVariable String seatNumber) {

        StudentResult result =
                service.getBySeatNumber(seatNumber);

        if (result == null) {
            return ResponseEntity
                    .status(404)
                    .body("Student result not found");
        }

        return ResponseEntity.ok(convertToResponse(result));
    }

    @GetMapping("/verify/{seatNumber}")
    public ResponseEntity<?> verifyResult(
            @PathVariable String seatNumber) {

        StudentResult result =
                service.getBySeatNumber(seatNumber);

        if (result == null) {
            return ResponseEntity
                    .status(404)
                    .body("Student result not found");
        }

        return ResponseEntity.ok(convertToResponse(result));
    }

    private StudentResultResponse convertToResponse(
            StudentResult result) {

        return new StudentResultResponse(
                result.getSeatNumber(),
                result.getStudentName(),
                result.getBoard(),
                result.getExamYear(),
                result.getStream(),
                result.getPercentage(),
                result.getResultStatus()
        );
    }
}