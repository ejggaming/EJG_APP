import apiClient from "./apiClient";

export interface LoginPayload {
  mobile: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  mobile: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    mobile: string;
    role: string;
    kycStatus: "pending" | "approved" | "rejected" | "none";
    isVerified: boolean;
  };
}

export const authService = {
  login: (data: LoginPayload) =>
    apiClient.post<AuthResponse>("/auth/login", data),

  register: (data: RegisterPayload) =>
    apiClient.post<{ message: string }>("/auth/register", data),

  verifyOtp: (mobile: string, otp: string) =>
    apiClient.post<AuthResponse>("/auth/verify-otp", { mobile, otp }),

  resendOtp: (mobile: string) =>
    apiClient.post<{ message: string }>("/auth/resend-otp", { mobile }),

  logout: () => apiClient.post("/auth/logout"),

  getProfile: () => apiClient.get<AuthResponse["user"]>("/auth/profile"),
};
