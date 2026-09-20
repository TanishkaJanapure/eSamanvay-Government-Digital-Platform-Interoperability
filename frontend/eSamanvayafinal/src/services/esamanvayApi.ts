const API_BASE_URL = "http://localhost:8091";

/** Demo identifiers for MVP demonstration */
export const DEMO_VERIFY_REQUEST: VerifyRequest = {
  digilockerId: "DL-MOCK-000001",
  certificateNumber: "INC-MH-2025-000001",
  seatNumber: "HSC-PUNE-2025-000001",
};

export interface VerificationRequest {
  digilockerId: string;
  certificateNumber: string;
  seatNumber: string;
}

/** @deprecated Use VerificationRequest */
export type VerifyRequest = VerificationRequest;

export interface DigiLockerData {
  digilockerid: string;
  name: string;
  dob: string;
  gender: string;
  eaadhaar: string;
  reference_key: string;
}

export interface EducationData {
  seatNumber: string;
  studentName: string;
  board: string;
  examYear: string;
  stream: string;
  percentage: number;
  resultStatus: string;
}

export interface IncomeData {
  certificateNumber: string;
  applicantName: string;
  financialYear: string;
  annualIncome: number;
  district: string;
  status: string;
}

export interface VerificationResponse {
  digiLocker: DigiLockerData;
  digiLockerVerified: boolean;
  education: EducationData;
  educationVerified: boolean;
  income: IncomeData;
  incomeVerified: boolean;
  overallStatus: string;
  studentName: string;
}

export class EsamanvayApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "EsamanvayApiError";
  }
}

/** @deprecated Use VerificationResponse */
export type VerifyResponse = VerificationResponse;

export function isFullyVerified(response: VerificationResponse): boolean {
  return (
    response.digiLockerVerified &&
    response.incomeVerified &&
    response.educationVerified &&
    response.overallStatus === "VERIFIED"
  );
}

export function formatDob(dob: string): string {
  if (dob.length !== 8) return dob;
  const day = dob.slice(0, 2);
  const month = dob.slice(2, 4);
  const year = dob.slice(4, 8);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const monthIndex = parseInt(month, 10) - 1;
  if (monthIndex < 0 || monthIndex > 11) return `${day}/${month}/${year}`;
  return `${parseInt(day, 10)} ${months[monthIndex]} ${year}`;
}

export function formatGender(gender: string): string {
  if (gender === "F") return "Female";
  if (gender === "M") return "Male";
  return gender;
}

export function formatIncome(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export async function verifyStudent(
  request: VerificationRequest = DEMO_VERIFY_REQUEST,
): Promise<VerificationResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/api/esamanvay/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
  } catch {
    throw new EsamanvayApiError(
      "Unable to reach eSamanvay orchestrator. Ensure the backend is running on port 8091.",
    );
  }

  if (!response.ok) {
    let detail = `Verification request failed (${response.status})`;
    try {
      const body = await response.text();
      if (body) detail = body;
    } catch {
      /* ignore parse errors */
    }
    throw new EsamanvayApiError(detail, response.status);
  }

  return response.json() as Promise<VerificationResponse>;
}
