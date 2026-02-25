import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Input } from "../../components";
import { loginSchema, type LoginInput } from "../../schema";
import { useLoginMutation } from "../../hooks/useAuth";

export default function LoginPage() {
  const [form, setForm] = useState<LoginInput>({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const login = useLoginMutation();

  const handleChange =
    (field: keyof LoginInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const handleSubmit = () => {
    setErrors({});
    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path.join(".")] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    login.mutate(result.data);
  };

  return (
    <div className="bg-surface-card rounded-2xl border border-border-default p-6">
      <h2 className="text-xl font-bold text-text-primary mb-1">Welcome Back</h2>
      <p className="text-text-muted text-sm mb-6">Sign in to place your bets</p>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="juan@example.com"
          value={form.email}
          onChange={handleChange("email")}
          error={errors.email}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange("password")}
          error={errors.password}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-text-muted">
            <input type="checkbox" className="rounded border-border-default accent-brand-red" />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-brand-gold hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth size="lg" isLoading={login.isPending}>
          Sign In
        </Button>
        <Link to="/">
          <Button type="button" variant="outline" fullWidth>
            Back to Home
          </Button>
        </Link>
      </form>

      <p className="text-center text-text-muted text-sm mt-6">
        Don't have an account?{" "}
        <Link to="/register" className="text-brand-gold font-semibold hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
