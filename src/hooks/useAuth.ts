import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { authService, type MeUser } from "../services/authService";
import type { LoginInput, RegisterInput, VerifyOtpInput } from "../schema";
import { useAppStore } from "../store/useAppStore";
import { getRoleHome } from "../components/guards/RoleGuard";
import toast from "react-hot-toast";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const authKeys = {
  me: ["auth", "me"] as const,
};

// ─── Session query (used in SessionProvider / App) ────────────────────────────

export function useSessionQuery() {
  const setUser = useAppStore((s) => s.setUser);
  const setInitialized = useAppStore((s) => s.setInitialized);

  return useQuery({
    queryKey: authKeys.me,
    queryFn: () => authService.me().then((res) => res.data.data!),
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    select: (data) => data,
    // Side-effects via onSuccess/onError not available in v5; handle in component via effects
    // The component reads data/isError from this hook and calls setUser/setInitialized
    meta: { setUser, setInitialized },
  });
}

// ─── Login ────────────────────────────────────────────────────────────────────

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setUser = useAppStore((s) => s.setUser);

  return useMutation<MeUser, AxiosError<{ message: string }>, LoginInput>({
    mutationFn: async (data) => {
      await authService.login(data);
      const res = await authService.me();
      return res.data.data!;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me, user);
      setUser(user);
      toast.success("Welcome back!");
      // If user had a pending bet before login, redirect to /bet
      const pendingBet = useAppStore.getState().pendingBet;
      if (pendingBet) {
        navigate("/bet");
      } else {
        navigate(getRoleHome(user.role));
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message ?? "Invalid credentials");
    },
  });
}

// ─── Register ─────────────────────────────────────────────────────────────────

export function useRegisterMutation(
  email: () => string,
  opts?: { onSuccess?: () => void }
) {
  const navigate = useNavigate();

  return useMutation<void, AxiosError<{ message: string }>, RegisterInput>({
    mutationFn: async (data) => {
      const { confirmPassword: _, ...payload } = data;
      if (!payload.userName) delete payload.userName;
      if (!payload.phoneNumber) delete payload.phoneNumber;
      await authService.register(payload);
    },
    onSuccess: () => {
      toast.success("Account created! Check your email for the OTP.");
      if (opts?.onSuccess) {
        opts.onSuccess();
      } else {
        navigate(`/verify-otp?email=${encodeURIComponent(email())}`);
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message ?? "Registration failed");
    },
  });
}

// ─── Verify OTP ───────────────────────────────────────────────────────────────

export function useVerifyOtpMutation() {
  const navigate = useNavigate();

  return useMutation<void, AxiosError<{ message: string }>, VerifyOtpInput>({
    mutationFn: (data) =>
      authService.verifyOtp(data).then(() => undefined),
    onSuccess: () => {
      toast.success("Email verified! Please sign in.");
      navigate("/login");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message ?? "Invalid OTP. Please try again.");
    },
  });
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const logout = useAppStore((s) => s.logout);

  return useMutation<void, AxiosError<{ message: string }>, void>({
    mutationFn: () => authService.logout().then(() => undefined),
    onSettled: () => {
      // Always clear local state even if server call fails
      logout();
      queryClient.clear();
      navigate("/login");
    },
  });
}

// ─── Resend OTP ───────────────────────────────────────────────────────────────

export function useResendOtpMutation() {
  return useMutation<void, AxiosError<{ message: string }>, string>({
    mutationFn: (email) => authService.resendOtp(email).then(() => undefined),
    onSuccess: () => toast.success("OTP resent — check your email"),
    onError: (err) =>
      toast.error(err.response?.data?.message ?? "Failed to resend OTP"),
  });
}
