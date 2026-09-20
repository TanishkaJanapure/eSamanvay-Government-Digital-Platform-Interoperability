package com.esamanvay.digilocker_service.controller;

public class DocumentResponse {

    private String uri;
    private String name;
    private String mime;
    private String doctype;
    private String description;
    private String issuerid;
    private String issuer;

    public DocumentResponse() {
    }

    public DocumentResponse(
            String uri,
            String name,
            String mime,
            String doctype,
            String description,
            String issuerid,
            String issuer) {

        this.uri = uri;
        this.name = name;
        this.mime = mime;
        this.doctype = doctype;
        this.description = description;
        this.issuerid = issuerid;
        this.issuer = issuer;
    }

    public String getUri() {
        return uri;
    }

    public String getName() {
        return name;
    }

    public String getMime() {
        return mime;
    }

    public String getDoctype() {
        return doctype;
    }

    public String getDescription() {
        return description;
    }

    public String getIssuerid() {
        return issuerid;
    }

    public String getIssuer() {
        return issuer;
    }
}