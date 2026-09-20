package com.esamanvay.esamanvay_service.dto;

import java.util.Map;

public class VerificationResponse {

    private String overallStatus;
    private String studentName;

    private boolean digiLockerVerified;
    private boolean incomeVerified;
    private boolean educationVerified;

    private Map<String, Object> digiLocker;
    private Map<String, Object> income;
    private Map<String, Object> education;

    public VerificationResponse() {
    }

    public String getOverallStatus() {
        return overallStatus;
    }

    public void setOverallStatus(String overallStatus) {
        this.overallStatus = overallStatus;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public boolean isDigiLockerVerified() {
        return digiLockerVerified;
    }

    public void setDigiLockerVerified(boolean digiLockerVerified) {
        this.digiLockerVerified = digiLockerVerified;
    }

    public boolean isIncomeVerified() {
        return incomeVerified;
    }

    public void setIncomeVerified(boolean incomeVerified) {
        this.incomeVerified = incomeVerified;
    }

    public boolean isEducationVerified() {
        return educationVerified;
    }

    public void setEducationVerified(boolean educationVerified) {
        this.educationVerified = educationVerified;
    }

    public Map<String, Object> getDigiLocker() {
        return digiLocker;
    }

    public void setDigiLocker(Map<String, Object> digiLocker) {
        this.digiLocker = digiLocker;
    }

    public Map<String, Object> getIncome() {
        return income;
    }

    public void setIncome(Map<String, Object> income) {
        this.income = income;
    }

    public Map<String, Object> getEducation() {
        return education;
    }

    public void setEducation(Map<String, Object> education) {
        this.education = education;
    }
}