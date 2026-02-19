import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input } from "../../components";
import { registerSchema, type RegisterInput } from "../../schema";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterInput>({
    name: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleChange =
    (field: keyof RegisterInput) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!agreed) {
      toast.error("Please accept the Terms & Conditions");
      return;
    }

    const result = registerSchema.safeParse(form);
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
      // Simulated registration — replace with real API call
      await new Promise((r) => setTimeout(r, 1200));
      toast.success("Account created! Please verify your mobile number.");
      navigate("/verify-otp");
    } catch {
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-card rounded-2xl border border-border-default p-6">
      <h2 className="text-xl font-bold text-text-primary mb-1">
        Create Account
      </h2>
      <p className="text-text-muted text-sm mb-6">
        Join JuetengPH and start winning
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="Juan Dela Cruz"
          value={form.name}
          onChange={handleChange("name")}
          error={errors.name}
        />

        <Input
          label="Mobile Number"
          placeholder="09XXXXXXXXX"
          value={form.mobile}
          onChange={handleChange("mobile")}
          error={errors.mobile}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Min. 8 chars, 1 uppercase, 1 number"
          value={form.password}
          onChange={handleChange("password")}
          error={errors.password}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Re-enter your password"
          value={form.confirmPassword}
          onChange={handleChange("confirmPassword")}
          error={errors.confirmPassword}
        />

        <label className="flex items-start gap-2 text-sm text-text-muted cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 rounded border-border-default accent-brand-red"
          />
          <span>
            I am 18+ years old and agree to the{" "}
            <span className="text-brand-gold">Terms & Conditions</span> and{" "}
            <span className="text-brand-gold">Responsible Gaming Policy</span>
          </span>
        </label>

        <Button type="submit" fullWidth size="lg" isLoading={loading}>
          Create Account
        </Button>
      </form>

      <p className="text-center text-text-muted text-sm mt-6">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-brand-gold font-semibold hover:underline"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
