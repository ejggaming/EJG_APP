import apiClient from "./apiClient";
import type { LoginInput, RegisterInput, VerifyOtpInput } from "../schema/auth.schema";

type RegisterPayload = Omit<RegisterInput, "confirmPassword">;

export interface AuthUser {
  id: string;
  email: string;
  userName: string | null;
  role: "PLAYER" | "AGENT" | "ADMIN" | "SUPER_ADMIN";
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  person?: { firstName: string; lastName: string } | null;
}

export interface MeUser extends AuthUser {
  phoneNumber: string | null;
  status: "active" | "inactive" | "suspended" | "archived";
  avatar: string | null;
  lastLogin: string | null;
  person: {
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth?: string;
    nationality?: string;
    gender?: string;
  } | null;
  wallet: {
    id: string;
    balance: number;
    bonus: number;
    currency: string;
    status: string;
  } | null;
  kyc: { status: string; submittedAt: string; reviewedAt: string | null } | null;
  agent: {
    id: string;
    role: string;
    status: string;
    commissionRate: number;
  } | null;
}

interface ApiSuccess<T> {
  status: "success";
  message: string;
  data?: T;
  code: number;
  timestamp: string;
}

export const authService = {
  register: (data: RegisterPayload) =>
    apiClient.post<ApiSuccess<{ user: AuthUser; accessToken: string }>>(
      "/auth/register",
      data,
    ),

  login: (data: LoginInput) =>
    apiClient.post<ApiSuccess<{ user: AuthUser; accessToken: string }>>(
      "/auth/login",
      data,
    ),

  verifyOtp: (data: VerifyOtpInput) =>
    apiClient.post<ApiSuccess<{ verified: boolean; type: string }>>(
      "/auth/otp/verify",
      data,
    ),

  resendOtp: (email: string) =>
    apiClient.post<ApiSuccess<{ expiresAt: string }>>("/auth/otp/request", {
      email,
      type: "EMAIL_VERIFICATION",
    }),

  logout: () => apiClient.post<ApiSuccess<null>>("/auth/logout"),

  me: () => apiClient.get<ApiSuccess<MeUser>>("/auth/me"),
};
