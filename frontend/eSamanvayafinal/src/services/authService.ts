import { DEMO_USER_CREDENTIALS } from "../data/scheme";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  mobile: string;
  dob: string;
  gender: string;
  aadhaarLast4: string;
  accountCreated: string;
  /** Pre-filled verification identifiers for demo user only */
  digilockerId?: string;
  certificateNumber?: string;
  seatNumber?: string;
}

interface StoredUser extends UserProfile {
  passwordHash: string;
}

const USERS_KEY = "esamanvay_users";
const SESSION_KEY = "esamanvay_session";

function hashPassword(password: string): string {
  return btoa(`esamanvay-mvp:${password}`);
}

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw) as StoredUser[];
  } catch {
    /* ignore corrupt storage */
  }
  return [];
}

function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function ensureDemoUser(): void {
  const users = loadUsers();
  if (users.some((u) => u.email === DEMO_USER_CREDENTIALS.email)) return;

  const demo: StoredUser = {
    id: "user-demo-001",
    name: DEMO_USER_CREDENTIALS.name,
    email: DEMO_USER_CREDENTIALS.email,
    mobile: DEMO_USER_CREDENTIALS.mobile,
    dob: "15 January 2004",
    gender: "Male",
    aadhaarLast4: "0001",
    accountCreated: new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    digilockerId: DEMO_USER_CREDENTIALS.digilockerId,
    certificateNumber: DEMO_USER_CREDENTIALS.certificateNumber,
    seatNumber: DEMO_USER_CREDENTIALS.seatNumber,
    passwordHash: hashPassword(DEMO_USER_CREDENTIALS.password),
  };
  saveUsers([...users, demo]);
}

function toProfile(user: StoredUser): UserProfile {
  const { passwordHash: _pw, ...profile } = user;
  return profile;
}

export function initAuth(): void {
  ensureDemoUser();
}

export function getSessionUserId(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function getCurrentUser(): UserProfile | null {
  initAuth();
  const userId = getSessionUserId();
  if (!userId) return null;
  const user = loadUsers().find((u) => u.id === userId);
  return user ? toProfile(user) : null;
}

export function registerUser(
  profile: Omit<UserProfile, "id">,
  password: string,
): { ok: true; user: UserProfile } | { ok: false; error: string } {
  initAuth();
  const users = loadUsers();

  if (users.some((u) => u.email.toLowerCase() === profile.email.toLowerCase())) {
    return { ok: false, error: "An account with this email already exists. Please log in." };
  }

  const normalizedMobile = profile.mobile.replace(/\D/g, "").slice(-10);
  if (users.some((u) => u.mobile.replace(/\D/g, "").slice(-10) === normalizedMobile)) {
    return { ok: false, error: "An account with this mobile number already exists." };
  }

  const user: StoredUser = {
    ...profile,
    id: `user-${Date.now()}`,
    mobile: normalizedMobile,
    passwordHash: hashPassword(password),
  };
  saveUsers([...users, user]);
  localStorage.setItem(SESSION_KEY, user.id);
  return { ok: true, user: toProfile(user) };
}

export function loginUser(
  identifier: string,
  password: string,
): { ok: true; user: UserProfile } | { ok: false; error: string } {
  initAuth();
  const users = loadUsers();
  const id = identifier.trim().toLowerCase();
  const digits = identifier.replace(/\D/g, "");

  const user = users.find(
    (u) =>
      u.email.toLowerCase() === id ||
      u.mobile.replace(/\D/g, "").slice(-10) === digits.slice(-10) ||
      u.id === identifier.trim(),
  );

  if (!user || user.passwordHash !== hashPassword(password)) {
    return { ok: false, error: "Invalid credentials. Please check your login details and try again." };
  }

  localStorage.setItem(SESSION_KEY, user.id);
  return { ok: true, user: toProfile(user) };
}

export function loginUserWithOtp(
  identifier: string,
  otp: string,
): { ok: true; user: UserProfile } | { ok: false; error: string } {
  if (otp !== "123456") {
    return { ok: false, error: "Invalid OTP. For this SIH prototype, use demo OTP: 123456." };
  }
  initAuth();
  const users = loadUsers();
  const id = identifier.trim().toLowerCase();
  const digits = identifier.replace(/\D/g, "");
  const user = users.find(
    (u) =>
      u.email.toLowerCase() === id ||
      u.mobile.replace(/\D/g, "").slice(-10) === digits.slice(-10),
  );
  if (!user) {
    return { ok: false, error: "No account found for this identifier. Please register first." };
  }
  localStorage.setItem(SESSION_KEY, user.id);
  return { ok: true, user: toProfile(user) };
}

export function logoutUser(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getCitizenId(userId: string): string {
  return `CSZ-${userId.slice(-4).toUpperCase()}-MH`;
}
