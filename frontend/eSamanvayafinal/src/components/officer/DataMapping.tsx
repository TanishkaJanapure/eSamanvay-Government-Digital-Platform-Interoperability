import { useState } from "react";

/* ─── Types ───────────────────────────────────────────── */
type MappingStatus = "verified" | "transformed" | "conflict" | "missing" | "passthrough";
type DataType = "string" | "date" | "integer" | "boolean" | "enum";

interface MappingRow {
  id: string;
  sourceSystem: string;
  sourceField: string;
  sourceType: DataType;
  sourceExample: string;
  commonField: string;
  commonType: DataType;
  targetSystem: string;
  targetField: string;
  targetType: DataType;
  targetExample: string;
  transformation: string;
  validationRule: string;
  status: MappingStatus;
  notes?: string;
}

interface Schema {
  id: string;
  service: string;
  dept: string;
  version: string;
  fieldCount: number;
  lastUpdated: string;
}

/* ─── Data ────────────────────────────────────────────── */
const SCHEMAS: Schema[] = [
  { id: "sc-scholarship", service: "State Scholarship SC/ST 2024–25", dept: "Social Justice", version: "v2.4", fieldCount: 22, lastUpdated: "Oct 2024" },
  { id: "income-cert", service: "Income Certificate", dept: "Revenue Department", version: "v1.8", fieldCount: 14, lastUpdated: "Aug 2024" },
  { id: "pm-kisan", service: "PM-KISAN Beneficiary Enrolment", dept: "Agriculture", version: "v3.1", fieldCount: 18, lastUpdated: "Sep 2024" },
  { id: "ration-card", service: "Ration Card Renewal", dept: "Civil Supplies", version: "v2.0", fieldCount: 16, lastUpdated: "Jul 2024" },
];

const MAPPINGS: MappingRow[] = [
  {
    id: "m-001",
    sourceSystem: "Aadhaar eKYC (UIDAI)",
    sourceField: "name",
    sourceType: "string",
    sourceExample: "PRIYA RAMESH SHARMA",
    commonField: "full_name",
    commonType: "string",
    targetSystem: "Social Justice Dept API",
    targetField: "applicantName",
    targetType: "string",
    targetExample: "Priya Ramesh Sharma",
    transformation: "UPPER_CASE → Title Case",
    validationRule: "min_length: 3, max_length: 100, pattern: [A-Za-z ]",
    status: "transformed",
    notes: "Aadhaar returns names in ALL CAPS. eSamanvaya normalises to Title Case before forwarding.",
  },
  {
    id: "m-002",
    sourceSystem: "Aadhaar eKYC (UIDAI)",
    sourceField: "dob",
    sourceType: "date",
    sourceExample: "04/03/1994",
    commonField: "date_of_birth",
    commonType: "date",
    targetSystem: "Social Justice Dept API",
    targetField: "dateOfBirth",
    targetType: "date",
    targetExample: "1994-03-14",
    transformation: "DD/MM/YYYY → ISO 8601 (YYYY-MM-DD)",
    validationRule: "valid_date, not_future, age >= 18",
    status: "conflict",
    notes: "Source mismatch: Aadhaar 04 Mar 1994 vs DigiLocker 14 Mar 1994. Conflict flagged. Citizen resolved to 14 Mar 1994.",
  },
  {
    id: "m-003",
    sourceSystem: "DigiLocker (NIC)",
    sourceField: "caste_category",
    sourceType: "string",
    sourceExample: "SC",
    commonField: "social_category",
    commonType: "enum",
    targetSystem: "Social Justice Dept API",
    targetField: "category",
    targetType: "enum",
    targetExample: "ScheduledCaste",
    transformation: 'Enum expansion: "SC" → "ScheduledCaste"',
    validationRule: "enum: [General, OBC, SC, ST, NT, SBC]",
    status: "transformed",
  },
  {
    id: "m-004",
    sourceSystem: "Income Certificate DB (Revenue)",
    sourceField: "annual_income",
    sourceType: "string",
    sourceExample: '"148000"',
    commonField: "annual_income_inr",
    commonType: "integer",
    targetSystem: "Social Justice Dept API",
    targetField: "annualIncome",
    targetType: "integer",
    targetExample: "148000",
    transformation: 'String → Integer coercion: "148000" → 148000',
    validationRule: "type: integer, min: 0, max: 10000000",
    status: "transformed",
    notes: "Revenue DB stores income as a VARCHAR field. Type coercion applied in Data Mapper.",
  },
  {
    id: "m-005",
    sourceSystem: "Aadhaar eKYC (UIDAI)",
    sourceField: "address.pincode",
    sourceType: "string",
    sourceExample: "411005",
    commonField: "pincode",
    commonType: "string",
    targetSystem: "Social Justice Dept API",
    targetField: "permanentAddressPIN",
    targetType: "string",
    targetExample: "411005",
    transformation: "Passthrough (no transformation)",
    validationRule: "pattern: ^[1-9][0-9]{5}$",
    status: "passthrough",
  },
  {
    id: "m-006",
    sourceSystem: "PFMS Gateway (CGA)",
    sourceField: "beneficiary_bank_account",
    sourceType: "string",
    sourceExample: "[TIMEOUT — not received]",
    commonField: "bank_account_number",
    commonType: "string",
    targetSystem: "Social Justice Dept API",
    targetField: "bankAccountNo",
    targetType: "string",
    targetExample: "XXXXXXXX4821 (manual entry)",
    transformation: "Fallback: citizen manual entry when PFMS timeout",
    validationRule: "length: 9–18 digits, luhn_check",
    status: "missing",
    notes: "PFMS timed out after 1840ms. Citizen entered account number manually. Bank details verified against IFSC Registry.",
  },
  {
    id: "m-007",
    sourceSystem: "DigiLocker (NIC)",
    sourceField: "aadhaar_uid",
    sourceType: "string",
    sourceExample: "XXXX-XXXX-4821",
    commonField: "aadhaar_masked",
    commonType: "string",
    targetSystem: "Social Justice Dept API",
    targetField: "aadhaarLastFour",
    targetType: "string",
    targetExample: "4821",
    transformation: "Masked UID → last 4 digits extraction",
    validationRule: "pattern: ^[0-9]{4}$",
    status: "transformed",
  },
  {
    id: "m-008",
    sourceSystem: "Caste Certificate Registry",
    sourceField: "certificate_issue_date",
    sourceType: "date",
    sourceExample: "12-08-2019",
    commonField: "caste_cert_date",
    commonType: "date",
    targetSystem: "Social Justice Dept API",
    targetField: "casteCertDate",
    targetType: "date",
    targetExample: "2019-08-12",
    transformation: "DD-MM-YYYY → ISO 8601",
    validationRule: "valid_date, not_future",
    status: "verified",
  },
];

const STATUS_META: Record<MappingStatus, { label: string; color: string; bg: string; border: string }> = {
  verified: { label: "Verified", color: "#0D9488", bg: "#F0FDFA", border: "#99F6E4" },
  transformed: { label: "Transformed", color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE" },
  conflict: { label: "Conflict", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  missing: { label: "Missing / Fallback", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
  passthrough: { label: "Passthrough", color: "#64748B", bg: "#F8FAFC", border: "#E2E8F0" },
};

const TYPE_COLORS: Record<DataType, string> = {
  string: "#1D4ED8",
  date: "#0D9488",
  integer: "#7C3AED",
  boolean: "#D97706",
  enum: "#DC2626",
};

/* ─── Mapping detail panel ────────────────────────────── */
function MappingDetail({ row, onClose }: { row: MappingRow; onClose: () => void }) {
  const sm = STATUS_META[row.status];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20">
      <div className="bg-white rounded-2xl border shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto" style={{ borderColor: "#E2E8F0" }}>
        <div className="flex items-start justify-between px-5 py-4 border-b sticky top-0 bg-white" style={{ borderColor: "#F1F5F9" }}>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-mono text-xs font-bold" style={{ color: "#94A3B8" }}>{row.id}</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ color: sm.color, background: sm.bg }}>{sm.label}</span>
            </div>
            <h3 className="text-sm font-semibold" style={{ color: "#0F172A" }}>
              <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: "#F1F5F9" }}>{row.sourceField}</code>
              {" → "}
              <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: "#F0FDFA", color: "#0D9488" }}>{row.commonField}</code>
              {" → "}
              <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: "#F5F3FF", color: "#7C3AED" }}>{row.targetField}</code>
            </h3>
          </div>
          <button onClick={onClose}>
            <svg width="16" height="16" fill="none" stroke="#CBD5E1" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-5 py-5 space-y-5">
          {/* Flow */}
          <div>
            <p className="text-xs font-semibold mb-3" style={{ color: "#64748B" }}>Data flow</p>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { label: row.sourceSystem, field: row.sourceField, example: row.sourceExample, type: row.sourceType, bg: "#F1F5F9", color: "#334155" },
                { label: "eSamanvaya Common Model", field: row.commonField, example: "normalised", type: row.commonType, bg: "#EFF6FF", color: "#1D4ED8" },
                { label: row.targetSystem, field: row.targetField, example: row.targetExample, type: row.targetType, bg: "#F5F3FF", color: "#7C3AED" },
              ].map((node, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="px-3 py-2.5 rounded-xl text-xs flex-shrink-0" style={{ background: node.bg }}>
                    <div className="font-bold text-xs" style={{ color: "#94A3B8" }}>{node.label}</div>
                    <div className="font-mono font-bold mt-0.5" style={{ color: node.color }}>{node.field}</div>
                    <div className="font-mono text-xs mt-0.5" style={{ color: "#94A3B8" }}>{node.example}</div>
                    <div className="px-1.5 py-0.5 rounded mt-1 inline-block text-white font-bold" style={{ background: TYPE_COLORS[node.type], fontSize: "9px" }}>{node.type}</div>
                  </div>
                  {i < 2 && (
                    <svg width="18" height="18" fill="none" stroke="#CBD5E1" strokeWidth="1.75" viewBox="0 0 24 24" className="flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="font-semibold mb-1.5" style={{ color: "#64748B" }}>Transformation</p>
              <p className="font-mono px-3 py-2 rounded-lg leading-relaxed" style={{ background: "#F5F3FF", color: "#5B21B6" }}>{row.transformation}</p>
            </div>
            <div>
              <p className="font-semibold mb-1.5" style={{ color: "#64748B" }}>Validation Rule</p>
              <p className="font-mono px-3 py-2 rounded-lg leading-relaxed" style={{ background: "#F8FAFC", color: "#334155" }}>{row.validationRule}</p>
            </div>
          </div>

          {row.notes && (
            <div>
              <p className="text-xs font-semibold mb-1.5" style={{ color: "#64748B" }}>Notes</p>
              <p className="text-xs leading-relaxed px-3 py-2.5 rounded-lg" style={{ background: "#FFFBEB", color: "#92400E", border: "1px solid #FDE68A" }}>{row.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main export ─────────────────────────────────────── */
export default function DataMapping() {
  const [selectedSchema, setSelectedSchema] = useState(SCHEMAS[0].id);
  const [selected, setSelected] = useState<MappingRow | null>(null);
  const [statusFilter, setStatusFilter] = useState<MappingStatus | "all">("all");

  const filtered = MAPPINGS.filter((m) => statusFilter === "all" || m.status === statusFilter);
  const schema = SCHEMAS.find((s) => s.id === selectedSchema)!;

  return (
    <div className="space-y-5">
      {selected && <MappingDetail row={selected} onClose={() => setSelected(null)} />}

      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "#0F172A", letterSpacing: "-0.02em" }}>Data Mapping</h1>
        <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>How eSamanvaya translates data between source government systems and the common interoperability model</p>
      </div>

      {/* Explainer */}
      <div className="bg-white rounded-xl border p-5" style={{ borderColor: "#E2E8F0" }}>
        <p className="text-xs font-semibold mb-3" style={{ color: "#64748B" }}>How it works</p>
        <div className="flex items-center gap-3 flex-wrap">
          {[
            { label: "Source System", sub: "e.g. Aadhaar eKYC", field: "student_name", bg: "#F1F5F9", color: "#334155" },
            { label: "eSamanvaya Common Model", sub: "Normalised field", field: "full_name", bg: "#EFF6FF", color: "#1D4ED8" },
            { label: "Target System", sub: "e.g. Social Justice API", field: "applicantName", bg: "#F5F3FF", color: "#7C3AED" },
          ].map((node, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="px-4 py-3 rounded-xl text-center" style={{ background: node.bg }}>
                <div className="text-xs" style={{ color: "#94A3B8" }}>{node.label}</div>
                <div className="text-xs" style={{ color: "#CBD5E1" }}>{node.sub}</div>
                <code className="text-sm font-bold mt-1 block" style={{ color: node.color }}>{node.field}</code>
              </div>
              {i < 2 && (
                <div className="flex flex-col items-center gap-0.5">
                  <svg width="24" height="24" fill="none" stroke="#1D4ED8" strokeWidth="1.75" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                  <span className="text-xs" style={{ color: "#CBD5E1" }}>transform</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Schema selector */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex gap-2 flex-wrap">
          {SCHEMAS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSchema(s.id)}
              className="px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all text-left"
              style={{
                background: selectedSchema === s.id ? "#0F172A" : "white",
                color: selectedSchema === s.id ? "white" : "#64748B",
                borderColor: selectedSchema === s.id ? "#0F172A" : "#E2E8F0",
              }}
            >
              {s.service.split(" ").slice(0, 3).join(" ")}…
              <span className="block text-xs font-normal mt-0.5 opacity-70">{s.dept} · {s.version}</span>
            </button>
          ))}
        </div>
        <div className="ml-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as MappingStatus | "all")}
            className="px-3 py-2 rounded-lg border text-xs outline-none"
            style={{ borderColor: "#E2E8F0", color: "#334155" }}
          >
            <option value="all">All Statuses</option>
            <option value="verified">Verified</option>
            <option value="transformed">Transformed</option>
            <option value="conflict">Conflict</option>
            <option value="missing">Missing / Fallback</option>
            <option value="passthrough">Passthrough</option>
          </select>
        </div>
      </div>

      {/* Schema meta */}
      <div className="flex items-center gap-4 px-4 py-3 rounded-xl" style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
        <div>
          <span className="text-xs font-semibold" style={{ color: "#1D4ED8" }}>{schema.service}</span>
          <span className="text-xs ml-2" style={{ color: "#93C5FD" }}>Schema {schema.version} · {schema.fieldCount} fields · Updated {schema.lastUpdated}</span>
        </div>
      </div>

      {/* Mapping table */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                {["Source System · Field", "→ Common Field", "→ Target Field", "Transformation", "Validation", "Status", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold whitespace-nowrap" style={{ color: "#64748B" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => {
                const sm = STATUS_META[row.status];
                return (
                  <tr
                    key={row.id}
                    className="border-b last:border-0 hover:bg-slate-50 transition-colors cursor-pointer"
                    style={{ borderColor: "#F1F5F9", background: i % 2 === 0 ? "white" : "#FAFCFF" }}
                    onClick={() => setSelected(row)}
                  >
                    {/* Source */}
                    <td className="px-4 py-3">
                      <div className="text-xs font-semibold" style={{ color: "#94A3B8" }}>{row.sourceSystem.split(" (")[0]}</div>
                      <code className="font-mono font-bold" style={{ color: "#334155" }}>{row.sourceField}</code>
                      <div className="mt-0.5">
                        <span className="px-1.5 py-0.5 rounded text-white font-bold" style={{ background: TYPE_COLORS[row.sourceType], fontSize: "9px" }}>{row.sourceType}</span>
                      </div>
                      <div className="font-mono mt-1 text-xs" style={{ color: "#94A3B8" }}>{row.sourceExample.slice(0, 20)}{row.sourceExample.length > 20 ? "…" : ""}</div>
                    </td>
                    {/* Common */}
                    <td className="px-4 py-3">
                      <code className="font-mono font-bold" style={{ color: "#1D4ED8" }}>{row.commonField}</code>
                      <div className="mt-0.5">
                        <span className="px-1.5 py-0.5 rounded text-white font-bold" style={{ background: TYPE_COLORS[row.commonType], fontSize: "9px" }}>{row.commonType}</span>
                      </div>
                    </td>
                    {/* Target */}
                    <td className="px-4 py-3">
                      <div className="text-xs" style={{ color: "#94A3B8" }}>{row.targetSystem.split(" (")[0]}</div>
                      <code className="font-mono font-bold" style={{ color: "#7C3AED" }}>{row.targetField}</code>
                      <div className="font-mono mt-1 text-xs" style={{ color: "#94A3B8" }}>{row.targetExample.slice(0, 18)}{row.targetExample.length > 18 ? "…" : ""}</div>
                    </td>
                    {/* Transform */}
                    <td className="px-4 py-3 max-w-[160px]">
                      <span className="font-mono" style={{ color: "#5B21B6" }}>{row.transformation.slice(0, 30)}{row.transformation.length > 30 ? "…" : ""}</span>
                    </td>
                    {/* Validation */}
                    <td className="px-4 py-3 max-w-[160px]">
                      <span className="font-mono" style={{ color: "#64748B" }}>{row.validationRule.slice(0, 28)}{row.validationRule.length > 28 ? "…" : ""}</span>
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap" style={{ color: sm.color, background: sm.bg }}>{sm.label}</span>
                    </td>
                    {/* Action */}
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold" style={{ color: "#1D4ED8" }}>Details</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs" style={{ color: "#CBD5E1" }}>
        Field mapping shown is for the selected schema and prototype data only. Only formatting is transformed — no data values are altered beyond type normalisation.
      </p>
    </div>
  );
}
