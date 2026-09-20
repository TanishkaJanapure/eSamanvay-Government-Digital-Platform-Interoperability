export type ServiceCategory =
  | "Education"
  | "Agriculture"
  | "Revenue"
  | "Welfare"
  | "Certificates"
  | "Health"
  | "Employment";

export type AppType = "Direct" | "Offline" | "Portal";

export interface Service {
  id: string;
  name: string;
  department: string;
  category: ServiceCategory;
  appType: AppType;
  description: string;
  eligibility: string;
  turnaround: string;
  integrated: boolean; // true = "Start Application", false = "Continue to Official Portal"
  portalUrl?: string;
  tags: string[];
}

export const SERVICES: Service[] = [
  {
    id: "s1",
    name: "Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna",
    department: "Directorate of Technical Education / MahaDBT",
    category: "Education",
    appType: "Direct",
    description: "EBC/EWS scholarship for bonafide students in professional/technical courses with CAP admission. Family income up to ₹8 lakh per year.",
    eligibility: "Maharashtra domicile, bonafide student in professional/technical course, CAP admission, family income ≤ ₹8 lakh, not receiving another scholarship.",
    turnaround: "30–45 working days",
    integrated: true,
    tags: ["scholarship", "EBC", "EWS", "student", "education", "MahaDBT", "technical", "professional"],
  },
  {
    id: "s2",
    name: "PM Scholarship for Central Armed Police",
    department: "Ministry of Home Affairs",
    category: "Education",
    appType: "Portal",
    description: "Merit-based scholarship for wards and widows of Central Armed Police Force and Railway Protection Force personnel.",
    eligibility: "Wards/widows of CAPF/RPF personnel. Minimum 60% marks in qualifying exam.",
    turnaround: "60 working days",
    integrated: false,
    portalUrl: "https://scholarships.gov.in",
    tags: ["scholarship", "CAPF", "student", "merit"],
  },
  {
    id: "s3",
    name: "PM-KISAN Samman Nidhi Registration",
    department: "Ministry of Agriculture & Farmers Welfare",
    category: "Agriculture",
    appType: "Direct",
    description: "Income support of ₹6,000 per year in three instalments to eligible farmer families owning cultivable land.",
    eligibility: "Farmer families with cultivable land holding. Excludes institutional landholders, government employees, income-tax payers.",
    turnaround: "15–20 working days",
    integrated: true,
    tags: ["farmer", "income support", "PM-KISAN", "agriculture", "subsidy"],
  },
  {
    id: "s4",
    name: "Kisan Credit Card",
    department: "NABARD / State Cooperative Banks",
    category: "Agriculture",
    appType: "Offline",
    description: "Short-term credit for farmers to meet cultivation expenses, post-harvest expenses, and allied activities.",
    eligibility: "Individual/joint borrower farmers, tenant farmers, sharecroppers. Verification by local bank branch required.",
    turnaround: "14 working days",
    integrated: false,
    portalUrl: "https://pmkisan.gov.in",
    tags: ["credit", "loan", "farmer", "agriculture", "KCC"],
  },
  {
    id: "s5",
    name: "Income Certificate",
    department: "Revenue Department",
    category: "Revenue",
    appType: "Direct",
    description: "Official certificate issued by the Revenue Department certifying the annual income of an individual or family for government benefit eligibility.",
    eligibility: "Any resident citizen requiring income proof for government schemes, admissions, or legal purposes.",
    turnaround: "7–10 working days",
    integrated: true,
    tags: ["income", "certificate", "revenue", "eligibility", "proof"],
  },
  {
    id: "s6",
    name: "Caste Certificate",
    department: "District Collectorate / Revenue",
    category: "Revenue",
    appType: "Direct",
    description: "Certificate certifying Scheduled Caste, Scheduled Tribe, or Other Backward Class status for benefit eligibility.",
    eligibility: "Citizens belonging to SC, ST, or OBC categories as notified by the State Government.",
    turnaround: "15 working days",
    integrated: true,
    tags: ["caste", "SC", "ST", "OBC", "certificate", "reservation"],
  },
  {
    id: "s7",
    name: "Domicile Certificate",
    department: "Revenue Department",
    category: "Revenue",
    appType: "Direct",
    description: "Certificate establishing permanent residency in the state for the purpose of admissions, government jobs, and scheme eligibility.",
    eligibility: "Residents who have lived in the state for 15 years or more, or were born in the state.",
    turnaround: "10–12 working days",
    integrated: true,
    tags: ["domicile", "residence", "certificate", "permanent"],
  },
  {
    id: "s8",
    name: "National Family Benefit Scheme",
    department: "Social Justice Department",
    category: "Welfare",
    appType: "Direct",
    description: "One-time financial assistance of ₹20,000 to BPL households on the death of the primary breadwinner.",
    eligibility: "BPL families where the deceased breadwinner was aged 18–59. Death must be reported within 90 days.",
    turnaround: "30 working days",
    integrated: true,
    tags: ["BPL", "welfare", "death benefit", "family", "financial aid"],
  },
  {
    id: "s9",
    name: "Sanjay Gandhi Niradhar Pension",
    department: "Social Justice Department",
    category: "Welfare",
    appType: "Direct",
    description: "Monthly pension for destitute individuals including orphans, deserted women, ex-convicts, and those with disability.",
    eligibility: "State residents in specific destitute categories. Income limit applies. Annual renewal required.",
    turnaround: "45 working days",
    integrated: false,
    portalUrl: "https://aaplesarkar.mahaonline.gov.in",
    tags: ["pension", "destitute", "welfare", "disability", "monthly"],
  },
  {
    id: "s10",
    name: "Birth Certificate",
    department: "Municipal Corporation / Gram Panchayat",
    category: "Certificates",
    appType: "Direct",
    description: "Legally valid birth certificate issued by the local civil registration authority for individuals born in India.",
    eligibility: "Any person born in India. Parents/guardians can apply on behalf of minors.",
    turnaround: "5–7 working days",
    integrated: true,
    tags: ["birth", "certificate", "civil registration", "ID proof"],
  },
  {
    id: "s11",
    name: "Marriage Certificate",
    department: "Municipal Corporation / Sub-Registrar",
    category: "Certificates",
    appType: "Direct",
    description: "Registration and certification of marriage under the Special Marriage Act or Hindu Marriage Act for legal recognition.",
    eligibility: "Both spouses must be present. Valid age proof, address proof, and two witnesses required.",
    turnaround: "7 working days",
    integrated: true,
    tags: ["marriage", "certificate", "registration", "civil"],
  },
  {
    id: "s12",
    name: "Ayushman Bharat Enrolment",
    department: "National Health Authority",
    category: "Health",
    appType: "Portal",
    description: "Enrolment under PM-JAY for health coverage of ₹5 lakh per family per year at empanelled public and private hospitals.",
    eligibility: "Eligible based on SECC 2011 database. BPL and specific occupational categories.",
    turnaround: "Instant verification",
    integrated: false,
    portalUrl: "https://pmjay.gov.in",
    tags: ["health", "insurance", "PM-JAY", "Ayushman", "hospital"],
  },
  {
    id: "s13",
    name: "Employment Exchange Registration",
    department: "Employment Department",
    category: "Employment",
    appType: "Direct",
    description: "Registration with the State Employment Exchange for job notification and placement assistance in government and private sectors.",
    eligibility: "Job-seekers who are residents of the state. Minimum education qualification of Class 8.",
    turnaround: "3 working days",
    integrated: true,
    tags: ["employment", "job", "registration", "exchange", "placement"],
  },
  {
    id: "s14",
    name: "Ration Card (New / Modification)",
    department: "Civil Supplies Department",
    category: "Welfare",
    appType: "Direct",
    description: "Application for a new ration card or modification of existing card details (name addition, address change, category upgrade) under NFSA.",
    eligibility: "Resident families not already holding a ration card in any state. Income and residency verification required.",
    turnaround: "21 working days",
    integrated: true,
    tags: ["ration card", "PDS", "food security", "NFSA", "welfare"],
  },
];

export const CATEGORIES: ServiceCategory[] = [
  "Education",
  "Agriculture",
  "Revenue",
  "Welfare",
  "Certificates",
  "Health",
  "Employment",
];

// AI query → matched service IDs + reason
export interface AIMatch {
  serviceId: string;
  reason: string;
  confidence: "High" | "Medium";
}

export const AI_QUERY_MAP: Record<string, AIMatch[]> = {
  scholarship: [
    { serviceId: "s1", reason: "Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna — EBC/EWS scholarship for eligible professional/technical students via MahaDBT.", confidence: "High" },
    { serviceId: "s2", reason: "PM Scholarship covers wards of armed police personnel — check if you or a family member is eligible.", confidence: "Medium" },
  ],
  student: [
    { serviceId: "s1", reason: "MahaDBT-integrated EBC/EWS tuition scholarship for bonafide students with CAP admission.", confidence: "High" },
    { serviceId: "s13", reason: "Employment Exchange registration can help you access job placement support after studies.", confidence: "Medium" },
  ],
  farmer: [
    { serviceId: "s3", reason: "PM-KISAN provides ₹6,000 per year directly to eligible farming families.", confidence: "High" },
    { serviceId: "s4", reason: "Kisan Credit Card offers short-term credit for cultivation expenses at subsidised rates.", confidence: "High" },
    { serviceId: "s5", reason: "Income Certificate may be required as supporting document for agricultural schemes.", confidence: "Medium" },
  ],
  income: [
    { serviceId: "s5", reason: "Revenue Department issues income certificates accepted across government schemes.", confidence: "High" },
    { serviceId: "s8", reason: "Income certificate is a prerequisite for National Family Benefit Scheme eligibility.", confidence: "Medium" },
  ],
  pension: [
    { serviceId: "s9", reason: "Sanjay Gandhi Niradhar Pension covers several destitute categories including persons with disability.", confidence: "High" },
    { serviceId: "s8", reason: "National Family Benefit Scheme provides one-time assistance after loss of breadwinner.", confidence: "Medium" },
  ],
  health: [
    { serviceId: "s12", reason: "Ayushman Bharat provides up to ₹5 lakh annual health coverage at listed hospitals.", confidence: "High" },
  ],
  ration: [
    { serviceId: "s14", reason: "Apply for a new ration card or modify existing card details under NFSA.", confidence: "High" },
    { serviceId: "s5", reason: "Income certificate is typically required as part of ration card application.", confidence: "Medium" },
  ],
  job: [
    { serviceId: "s13", reason: "Employment Exchange registration connects you to government and private sector job notifications.", confidence: "High" },
  ],
  certificate: [
    { serviceId: "s10", reason: "Birth certificate is the most fundamental civil document for identity proof.", confidence: "High" },
    { serviceId: "s5", reason: "Income certificate is required for most government benefit applications.", confidence: "High" },
    { serviceId: "s6", reason: "Caste certificate establishes SC/ST/OBC status for reservation and scheme benefits.", confidence: "Medium" },
  ],
};

export function aiSearch(query: string): AIMatch[] {
  const lower = query.toLowerCase();
  for (const [keyword, matches] of Object.entries(AI_QUERY_MAP)) {
    if (lower.includes(keyword)) return matches;
  }
  // fallback: return top 3 commonly needed services
  return [
    { serviceId: "s5", reason: "Income Certificate is required as a supporting document for most government schemes.", confidence: "Medium" },
    { serviceId: "s10", reason: "Birth Certificate is a foundational identity document often needed as prerequisite.", confidence: "Medium" },
    { serviceId: "s1", reason: "Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna for EBC/EWS category students meeting income and course criteria.", confidence: "Medium" },
  ];
}
