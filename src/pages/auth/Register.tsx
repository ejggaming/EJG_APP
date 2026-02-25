import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { Button, Input } from "../../components";
import { type RegisterInput } from "../../schema";
import { useRegisterMutation, useVerifyOtpMutation, useResendOtpMutation } from "../../hooks/useAuth";
import toast from "react-hot-toast";

// ── Per-step validation schemas ──
const step0Schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((val) => {
      const dob = new Date(val);
      if (isNaN(dob.getTime())) return false;
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      const actualAge = m < 0 || (m === 0 && today.getDate() < dob.getDate()) ? age - 1 : age;
      return actualAge >= 18;
    }, "You must be at least 18 years old"),
});

const step1Schema = z.object({
  email: z.string().email("Enter a valid email address"),
  userName: z.string().min(3, "Username must be at least 3 characters").optional().or(z.literal("")),
  phoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{7,14}$/, "Invalid phone number")
    .optional()
    .or(z.literal("")),
});

const step2Schema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const maxDOB = new Date();
  maxDOB.setFullYear(maxDOB.getFullYear() - 18);
  const maxDate = maxDOB.toISOString().split("T")[0];

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<RegisterInput>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    userName: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "PLAYER",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const register = useRegisterMutation(() => form.email, {
    onSuccess: () => setStep(4),
  });
  const verify = useVerifyOtpMutation();
  const resend = useResendOtpMutation();

  // ── Form handlers ──
  const handleChange = (field: keyof RegisterInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateStep = (stepNum: number): boolean => {
    setErrors({});
    let isValid = false;
    let stepData: Record<string, any> = {};

    if (stepNum === 0) {
      stepData = {
        firstName: form.firstName,
        lastName: form.lastName,
        dateOfBirth: form.dateOfBirth,
      };
      const result = step0Schema.safeParse(stepData);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          fieldErrors[issue.path.join(".")] = issue.message;
        });
        setErrors(fieldErrors);
        return false;
      }
      isValid = true;
    } else if (stepNum === 1) {
      stepData = {
        email: form.email,
        userName: form.userName,
        phoneNumber: form.phoneNumber,
      };
      const result = step1Schema.safeParse(stepData);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          fieldErrors[issue.path.join(".")] = issue.message;
        });
        setErrors(fieldErrors);
        return false;
      }
      isValid = true;
    } else if (stepNum === 2) {
      stepData = {
        password: form.password,
        confirmPassword: form.confirmPassword,
      };
      const result = step2Schema.safeParse(stepData);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          fieldErrors[issue.path.join(".")] = issue.message;
        });
        setErrors(fieldErrors);
        return false;
      }
      isValid = true;
    } else if (stepNum === 3) {
      if (!agreed) {
        toast.error("Please accept the Terms & Conditions");
        return false;
      }
      isValid = true;
    }

    return isValid;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;

    if (step === 3) {
      // Submit registration
      register.mutate(form);
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  // ── OTP handlers ──
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }
    verify.mutate({ email: form.email, code, type: "EMAIL_VERIFICATION" });
  };

  // ── Step indicator ──
  const stepLabels = ["Personal", "Contact", "Security", "Agreement", "Verify"];
  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {stepLabels.map((_label, i) => (
        <div key={i} className="flex items-center flex-1">
          {/* Step circle */}
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
              i < step
                ? "bg-brand-gold text-white"
                : i === step
                  ? "bg-brand-red text-white"
                  : "border-2 border-border-default text-text-muted"
            }`}
          >
            {i + 1}
          </div>

          {/* Connector line (not on last step) */}
          {i < stepLabels.length - 1 && (
            <div
              className={`flex-1 h-1 mx-2 transition-colors ${
                i < step ? "bg-brand-gold" : "bg-border-default"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-surface-card rounded-2xl border border-border-default p-6">
      <StepIndicator />

      {/* Step 0: Personal Info */}
      {step === 0 && (
        <>
          <h2 className="text-xl font-bold text-text-primary mb-1">Personal Information</h2>
          <p className="text-text-muted text-sm mb-6">Tell us about yourself</p>

          <form className="space-y-4">
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
              label="Date of Birth"
              type="date"
              max={maxDate}
              value={form.dateOfBirth}
              onChange={handleChange("dateOfBirth")}
              error={errors.dateOfBirth}
            />

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" fullWidth onClick={handleBack} disabled>
                Back
              </Button>
              <Button type="button" fullWidth size="lg" onClick={handleNext}>
                Next
              </Button>
            </div>
          </form>
        </>
      )}

      {/* Step 1: Contact */}
      {step === 1 && (
        <>
          <h2 className="text-xl font-bold text-text-primary mb-1">Contact Information</h2>
          <p className="text-text-muted text-sm mb-6">How can we reach you?</p>

          <form className="space-y-4">
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

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" fullWidth onClick={handleBack}>
                Back
              </Button>
              <Button type="button" fullWidth size="lg" onClick={handleNext}>
                Next
              </Button>
            </div>
          </form>
        </>
      )}

      {/* Step 2: Security */}
      {step === 2 && (
        <>
          <h2 className="text-xl font-bold text-text-primary mb-1">Security & Account Type</h2>
          <p className="text-text-muted text-sm mb-6">Set your password and choose your account type</p>

          <form className="space-y-4">
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

            <div>
              <p className="text-sm font-medium text-text-secondary mb-2">Account Type</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, role: "PLAYER" }))}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    form.role === "PLAYER"
                      ? "border-brand-red bg-brand-red/10 text-brand-red"
                      : "border-border-default text-text-muted hover:text-text-primary"
                  }`}
                >
                  Player
                </button>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, role: "AGENT" }))}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    form.role === "AGENT"
                      ? "border-brand-red bg-brand-red/10 text-brand-red"
                      : "border-border-default text-text-muted hover:text-text-primary"
                  }`}
                >
                  Agent
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" fullWidth onClick={handleBack}>
                Back
              </Button>
              <Button type="button" fullWidth size="lg" onClick={handleNext}>
                Next
              </Button>
            </div>
          </form>
        </>
      )}

      {/* Step 3: Agreement */}
      {step === 3 && (
        <>
          <h2 className="text-xl font-bold text-text-primary mb-1">Review & Agree</h2>
          <p className="text-text-muted text-sm mb-6">Please confirm to proceed</p>

          <form className="space-y-6">
            {/* Quick summary */}
            <div className="bg-surface-elevated rounded-lg p-4 space-y-2 text-sm">
              <p>
                <span className="font-semibold text-text-primary">{form.firstName} {form.lastName}</span>
              </p>
              <p className="text-text-muted">Email: {form.email}</p>
              <p className="text-text-muted">Account Type: {form.role}</p>
            </div>

            <label className="flex items-start gap-2 text-sm text-text-muted cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 rounded border-border-default accent-brand-red"
              />
              <span>
                I agree to the{" "}
                <span className="text-brand-gold">Terms & Conditions</span> and{" "}
                <span className="text-brand-gold">Responsible Gaming Policy</span>
              </span>
            </label>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" fullWidth onClick={handleBack}>
                Back
              </Button>
              <Button
                type="button"
                fullWidth
                size="lg"
                onClick={handleNext}
                isLoading={register.isPending}
              >
                Create Account
              </Button>
            </div>
          </form>
        </>
      )}

      {/* Step 4: OTP Verification */}
      {step === 4 && (
        <>
          <h2 className="text-xl font-bold text-text-primary mb-1">Verify Email</h2>
          <p className="text-text-muted text-sm mb-6">
            Enter the 6-digit code sent to <span className="text-brand-gold">{form.email}</span>
          </p>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(); }}>
            <div className="flex justify-center gap-3">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className="w-12 h-14 rounded-lg bg-surface-elevated border border-border-default text-center text-xl font-bold text-text-primary focus:border-brand-gold focus:ring-2 focus:ring-brand-gold focus:outline-none transition-colors"
                />
              ))}
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={verify.isPending}
              onClick={handleVerifyOtp}
            >
              Verify
            </Button>

            <p className="text-center text-text-muted text-sm">
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={() => resend.mutate(form.email)}
                disabled={resend.isPending}
                className="text-brand-gold font-semibold hover:underline cursor-pointer disabled:opacity-50"
              >
                {resend.isPending ? "Sending…" : "Resend OTP"}
              </button>
            </p>
          </form>
        </>
      )}

      {/* Footer */}
      {step < 4 && (
        <p className="text-center text-text-muted text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-gold font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      )}
    </div>
  );
}
