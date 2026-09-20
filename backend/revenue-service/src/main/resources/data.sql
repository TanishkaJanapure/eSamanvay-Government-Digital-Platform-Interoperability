INSERT INTO income_certificates
(
    certificate_number,
    applicant_name,
    aadhaar_number,
    financial_year,
    annual_income,
    district,
    status
)
VALUES
(
    'INC-MH-2025-000001',
    'Demo Student',
    '999999999999',
    '2024-2025',
    80000.00,
    'Pune',
    'VERIFIED'
)
ON CONFLICT (certificate_number) DO NOTHING;