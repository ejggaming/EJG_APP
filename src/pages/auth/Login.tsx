import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input } from "../../components";
import { loginSchema, type LoginInput } from "../../schema";
import { useAppStore } from "../../store/useAppStore";
import toast from "react-hot-toast";

export default function LoginPage() {
  const navigate = useNavigate();
  const setUser = useAppStore((s) => s.setUser);
  const setBalance = useAppStore((s) => s.setBalance);

  const [form, setForm] = useState<LoginInput>({ mobile: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange =
    (field: keyof LoginInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path.join(".");
        fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      // Simulated login — replace with real API call
      await new Promise((r) => setTimeout(r, 1000));
      setUser({
        id: "1",
        name: "Juan Dela Cruz",
        email: "juan@example.com",
        mobile: form.mobile,
        role: "player",
        kycStatus: "approved",
        isVerified: true,
      });
      setBalance(1500);
      toast.success("Welcome back!");
      navigate("/");
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-card rounded-2xl border border-gray-700/50 p-6">
      <h2 className="text-xl font-bold text-white mb-1">Welcome Back</h2>
      <p className="text-gray-400 text-sm mb-6">Sign in to place your bets</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Mobile Number"
          placeholder="09XXXXXXXXX"
          value={form.mobile}
          onChange={handleChange("mobile")}
          error={errors.mobile}
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          }
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange("password")}
          error={errors.password}
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          }
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-gray-400">
            <input
              type="checkbox"
              className="rounded border-gray-600 accent-brand-red"
            />
            Remember me
          </label>
          <Link
            to="/forgot-password"
            className="text-brand-gold hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth size="lg" isLoading={loading}>
          Sign In
        </Button>
      </form>

      <p className="text-center text-gray-400 text-sm mt-6">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-brand-gold font-semibold hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}
