package com.esamanvay.revenue_service.controller;

public class IncomeCertificateResponse {

    private String certificateNumber;
    private String applicantName;
    private String financialYear;
    private Double annualIncome;
    private String district;
    private String status;

    public IncomeCertificateResponse() {
    }

    public IncomeCertificateResponse(
            String certificateNumber,
            String applicantName,
            String financialYear,
            Double annualIncome,
            String district,
            String status) {

        this.certificateNumber = certificateNumber;
        this.applicantName = applicantName;
        this.financialYear = financialYear;
        this.annualIncome = annualIncome;
        this.district = district;
        this.status = status;
    }

    public String getCertificateNumber() {
        return certificateNumber;
    }

    public String getApplicantName() {
        return applicantName;
    }

    public String getFinancialYear() {
        return financialYear;
    }

    public Double getAnnualIncome() {
        return annualIncome;
    }

    public String getDistrict() {
        return district;
    }

    public String getStatus() {
        return status;
    }
}