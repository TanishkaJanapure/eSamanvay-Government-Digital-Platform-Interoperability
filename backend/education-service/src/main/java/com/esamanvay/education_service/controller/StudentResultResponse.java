package com.esamanvay.education_service.controller;

public class StudentResultResponse {

    private String seatNumber;
    private String studentName;
    private String board;
    private String examYear;
    private String stream;
    private Double percentage;
    private String resultStatus;

    public StudentResultResponse(
            String seatNumber,
            String studentName,
            String board,
            String examYear,
            String stream,
            Double percentage,
            String resultStatus) {

        this.seatNumber = seatNumber;
        this.studentName = studentName;
        this.board = board;
        this.examYear = examYear;
        this.stream = stream;
        this.percentage = percentage;
        this.resultStatus = resultStatus;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public String getStudentName() {
        return studentName;
    }

    public String getBoard() {
        return board;
    }

    public String getExamYear() {
        return examYear;
    }

    public String getStream() {
        return stream;
    }

    public Double getPercentage() {
        return percentage;
    }

    public String getResultStatus() {
        return resultStatus;
    }
}