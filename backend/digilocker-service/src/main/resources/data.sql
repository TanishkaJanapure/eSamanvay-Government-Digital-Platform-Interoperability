INSERT INTO digilocker_users 
(digilockerid, name, dob, gender, eaadhaar, reference_key, mobile, email) 
VALUES 
( 
    'DL-MOCK-000001', 
    'Demo Student', 
    '15052007', 
    'F', 
    'Y', 
    'REF-MOCK-000001', 
    '9876543210', 
    'student@example.com' 
) 
ON CONFLICT (digilockerid) DO NOTHING; 


INSERT INTO documents 
(name, type, size, date, parent, mime, uri, doctype, description, issuerid, issuer, digilockerid) 
VALUES 
( 
    'Class XII Marksheet', 
    'file', 
    '', 
    '2025-05-12T15:50:38Z', 
    '', 
    'application/pdf', 
    'in.gov.mock-HSCER-202500000001', 
    'HSCER', 
    'Class XII Marksheet', 
    'MSBSHSE', 
    'Maharashtra State Board of Secondary and Higher Secondary Education', 
    'DL-MOCK-000001' 
) 
ON CONFLICT (uri) DO NOTHING;