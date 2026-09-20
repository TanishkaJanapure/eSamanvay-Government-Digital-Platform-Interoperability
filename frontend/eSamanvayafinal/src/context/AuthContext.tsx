import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getCurrentUser,
  loginUser,
  loginUserWithOtp,
  logoutUser,
  registerUser,
  type UserProfile,
} from "../services/authService";
import type { RegisteredCitizenData } from "../pages/RegisterPage";

interface AuthContextValue {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  loginWithOtp: (identifier: string, otp: string) => Promise<{ ok: boolean; error?: string }>;
  register: (data: RegisteredCitizenData, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(() => {
    setUser(getCurrentUser());
  }, []);

  useEffect(() => {
    refreshUser();
    setIsLoading(false);
  }, [refreshUser]);

  const login = useCallback(async (identifier: string, password: string) => {
    const result = loginUser(identifier, password);
    if (result.ok) {
      setUser(result.user);
      return { ok: true };
    }
    return { ok: false, error: result.error };
  }, []);

  const loginWithOtp = useCallback(async (identifier: string, otp: string) => {
    const result = loginUserWithOtp(identifier, otp);
    if (result.ok) {
      setUser(result.user);
      return { ok: true };
    }
    return { ok: false, error: result.error };
  }, []);

  const register = useCallback(async (data: RegisteredCitizenData, password: string) => {
    const result = registerUser(
      {
        name: data.name,
        email: data.email,
        mobile: data.mobile.replace(/\D/g, "").slice(-10),
        dob: data.dob,
        gender: data.gender,
        aadhaarLast4: data.aadhaarLast4,
        accountCreated: data.accountCreated,
      },
      password,
    );
    if (result.ok) {
      setUser(result.user);
      return { ok: true };
    }
    return { ok: false, error: result.error };
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      loginWithOtp,
      register,
      logout,
      refreshUser,
    }),
    [user, isLoading, login, loginWithOtp, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
