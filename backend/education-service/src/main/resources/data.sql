-- ============================================================
-- eSamanvay - Education / Board Mock Database
-- Service Port: 8084
-- ============================================================

-- Demo Student Result
-- Change ONLY the values below when testing another student.

INSERT INTO student_results
(
    seat_number,
    student_name,
    board,
    exam_year,
    stream,
    percentage,
    result_status
)
VALUES
(
    'HSC-PUNE-2025-000001',       -- Student Seat Number
    'Demo Student',               -- Student Name
    'Maharashtra State Board',     -- Board
    '2025',                        -- Exam Year
    'Science',                     -- Stream
    82.40,                         -- Percentage
    'PASSED'                       -- Result Status
)
ON CONFLICT (seat_number) DO UPDATE SET
    student_name = EXCLUDED.student_name,
    board = EXCLUDED.board,
    exam_year = EXCLUDED.exam_year,
    stream = EXCLUDED.stream,
    percentage = EXCLUDED.percentage,
    result_status = EXCLUDED.result_status;