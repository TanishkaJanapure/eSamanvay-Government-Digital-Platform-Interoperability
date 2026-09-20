package com.esamanvay.digilocker_service.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "digilocker_users")
public class DigiLockerUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String digilockerid;

    private String name;
    private String dob;
    private String gender;
    private String eaadhaar;
    private String referenceKey;
    private String mobile;
    private String email;

    public DigiLockerUser() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDigilockerid() {
        return digilockerid;
    }

    public void setDigilockerid(String digilockerid) {
        this.digilockerid = digilockerid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDob() {
        return dob;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getEaadhaar() {
        return eaadhaar;
    }

    public void setEaadhaar(String eaadhaar) {
        this.eaadhaar = eaadhaar;
    }

    public String getReferenceKey() {
        return referenceKey;
    }

    public void setReferenceKey(String referenceKey) {
        this.referenceKey = referenceKey;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}