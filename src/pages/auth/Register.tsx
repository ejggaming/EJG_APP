import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Input } from "../../components";
import { registerSchema, type RegisterInput } from "../../schema";
import { useRegisterMutation } from "../../hooks/useAuth";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterInput>({
    firstName: "",
    lastName: "",
    email: "",
    userName: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);
  const register = useRegisterMutation(() => form.email);

  const handleChange =
    (field: keyof RegisterInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const handleSubmit = () => {
    setErrors({});
    if (!agreed) {
      toast.error("Please accept the Terms & Conditions");
      return;
    }
    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path.join(".")] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    register.mutate(result.data);
  };

  return (
    <div className="bg-surface-card rounded-2xl border border-border-default p-6">
      <h2 className="text-xl font-bold text-text-primary mb-1">Create Account</h2>
      <p className="text-text-muted text-sm mb-6">Join JuetengPH and start winning</p>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First Name"
            placeholder="Juan"
            value={form.firstName}
            onChange={handleChange("firstName")}
            error={errors.firstName}
          />
          <Input
            label="Last Name"
            placeholder="Dela Cruz"
            value={form.lastName}
            onChange={handleChange("lastName")}
            error={errors.lastName}
          />
        </div>

        <Input
          label="Email"
          type="email"
          placeholder="juan@example.com"
          value={form.email}
          onChange={handleChange("email")}
          error={errors.email}
        />

        <Input
          label="Username"
          placeholder="juandelacruz (optional)"
          value={form.userName ?? ""}
          onChange={handleChange("userName")}
          error={errors.userName}
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="+639171234567 (optional)"
          value={form.phoneNumber ?? ""}
          onChange={handleChange("phoneNumber")}
          error={errors.phoneNumber}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Min. 8 chars, 1 uppercase, 1 number, 1 special"
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

        <Button type="submit" fullWidth size="lg" isLoading={register.isPending}>
          Create Account
        </Button>
      </form>

      <p className="text-center text-text-muted text-sm mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-brand-gold font-semibold hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
