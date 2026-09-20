package com.esamanvay.esamanvay_service.service;

import com.esamanvay.esamanvay_service.dto.VerificationRequest;
import com.esamanvay.esamanvay_service.dto.VerificationResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
public class VerificationService {

    private final RestClient restClient;

    public VerificationService(RestClient restClient) {
        this.restClient = restClient;
    }

    public VerificationResponse verifyStudent(
            VerificationRequest request) {

        VerificationResponse response =
                new VerificationResponse();

        System.out.println(
                "========================================");

        System.out.println(
                "eSamanvay Verification Started");

        System.out.println(
                "DigiLocker ID: " + request.getDigilockerId());

        System.out.println(
                "Certificate Number: "
                        + request.getCertificateNumber());

        System.out.println(
                "Seat Number: "
                        + request.getSeatNumber());

        System.out.println(
                "========================================");


        /*
         * -------------------------------------------------
         * 1. DIGILOCKER VERIFICATION
         * -------------------------------------------------
         */

        boolean digiLockerVerified = false;
        Map<String, Object> digiLockerData = null;

        try {

            System.out.println(
                    "Calling DigiLocker Service :8081");

            /*
             * The DigiLocker mock service supports the
             * digilockerId through the query parameter.
             *
             * Example:
             * /user?digilockerId=DL001
             */

            String digiLockerUrl =
                    "http://localhost:8081/public/oauth2/1/user"
                            + "?digilockerId="
                            + request.getDigilockerId();

            ResponseEntity<Map> digiResponse =
                    restClient.get()
                            .uri(digiLockerUrl)
                            .header(
                                    "Authorization",
                                    "Bearer MOCK_ACCESS_TOKEN")
                            .retrieve()
                            .toEntity(Map.class);

            if (digiResponse.getStatusCode().is2xxSuccessful()) {

                digiLockerData =
                        digiResponse.getBody();

                if (digiLockerData != null) {

                    digiLockerVerified = true;

                    response.setStudentName(
                            String.valueOf(
                                    digiLockerData.get("name")));
                }
            }

            System.out.println(
                    "DigiLocker Result: "
                            + digiLockerVerified);

        } catch (Exception e) {

            System.out.println(
                    "DigiLocker Service Error: "
                            + e.getMessage());
        }


        /*
         * -------------------------------------------------
         * 2. REVENUE / INCOME CERTIFICATE VERIFICATION
         * -------------------------------------------------
         */

        boolean incomeVerified = false;
        Map<String, Object> incomeData = null;

        try {

            System.out.println(
                    "Calling Revenue Service :8082");

            String incomeUrl =
                    "http://localhost:8082/api/revenue/"
                            + "income-certificate/verify/"
                            + request.getCertificateNumber();

            ResponseEntity<Map> incomeResponse =
                    restClient.get()
                            .uri(incomeUrl)
                            .retrieve()
                            .toEntity(Map.class);

            if (incomeResponse.getStatusCode()
                    .is2xxSuccessful()) {

                incomeData =
                        incomeResponse.getBody();

                if (incomeData != null) {

                    String status =
                            String.valueOf(
                                    incomeData.get("status"));

                    incomeVerified =
                            "VERIFIED"
                                    .equalsIgnoreCase(status);
                }
            }

            System.out.println(
                    "Revenue Result: "
                            + incomeVerified);

        } catch (Exception e) {

            System.out.println(
                    "Revenue Service Error: "
                            + e.getMessage());
        }


        /*
         * -------------------------------------------------
         * 3. EDUCATION VERIFICATION
         * -------------------------------------------------
         */

        boolean educationVerified = false;
        Map<String, Object> educationData = null;

        try {

            System.out.println(
                    "Calling Education Service :8084");

            String educationUrl =
                    "http://localhost:8084/api/education/verify/"
                            + request.getSeatNumber();

            ResponseEntity<Map> educationResponse =
                    restClient.get()
                            .uri(educationUrl)
                            .retrieve()
                            .toEntity(Map.class);

            if (educationResponse.getStatusCode()
                    .is2xxSuccessful()) {

                educationData =
                        educationResponse.getBody();

                if (educationData != null) {

                    String status =
                            String.valueOf(
                                    educationData
                                            .get("resultStatus"));

                    educationVerified =
                            "PASSED"
                                    .equalsIgnoreCase(status);
                }
            }

            System.out.println(
                    "Education Result: "
                            + educationVerified);

        } catch (Exception e) {

            System.out.println(
                    "Education Service Error: "
                            + e.getMessage());
        }


        /*
         * -------------------------------------------------
         * 4. FINAL VERIFICATION RESULT
         * -------------------------------------------------
         */

        boolean allVerified =
                digiLockerVerified
                        && incomeVerified
                        && educationVerified;


        response.setDigiLockerVerified(
                digiLockerVerified);

        response.setIncomeVerified(
                incomeVerified);

        response.setEducationVerified(
                educationVerified);

        response.setDigiLocker(
                digiLockerData);

        response.setIncome(
                incomeData);

        response.setEducation(
                educationData);


        if (allVerified) {

            response.setOverallStatus(
                    "VERIFIED");

        } else {

            response.setOverallStatus(
                    "NOT_VERIFIED");
        }


        System.out.println(
                "========================================");

        System.out.println(
                "DigiLocker Verified : "
                        + digiLockerVerified);

        System.out.println(
                "Income Verified     : "
                        + incomeVerified);

        System.out.println(
                "Education Verified  : "
                        + educationVerified);

        System.out.println(
                "Final Verification  : "
                        + response.getOverallStatus());

        System.out.println(
                "Student             : "
                        + response.getStudentName());

        System.out.println(
                "========================================");


        return response;
    }
}