package com.esamanvay.esamanvay_service.dto;

public class VerificationRequest {

    private String digilockerId;
    private String certificateNumber;
    private String seatNumber;

    public VerificationRequest() {
    }

    public String getDigilockerId() {
        return digilockerId;
    }

    public void setDigilockerId(String digilockerId) {
        this.digilockerId = digilockerId;
    }

    public String getCertificateNumber() {
        return certificateNumber;
    }

    public void setCertificateNumber(String certificateNumber) {
        this.certificateNumber = certificateNumber;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }
}