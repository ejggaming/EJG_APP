import { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "../../components";
import { useVerifyOtpMutation, useResendOtpMutation } from "../../hooks/useAuth";
import toast from "react-hot-toast";

export default function VerifyOtpPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const verify = useVerifyOtpMutation();
  const resend = useResendOtpMutation();

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }
    verify.mutate({ email, code, type: "EMAIL_VERIFICATION" });
  };

  return (
    <div className="bg-surface-card rounded-2xl border border-border-default p-6">
      <h2 className="text-xl font-bold text-text-primary mb-1">Verify Email</h2>
      <p className="text-text-muted text-sm mb-6">
        Enter the 6-digit code sent to{" "}
        <span className="text-brand-gold">{email || "your email"}</span>
      </p>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
        <div className="flex justify-center gap-3">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-14 rounded-lg bg-surface-elevated border border-border-default text-center text-xl font-bold text-text-primary focus:border-brand-gold focus:ring-2 focus:ring-brand-gold focus:outline-none transition-colors"
            />
          ))}
        </div>

        <Button type="submit" fullWidth size="lg" isLoading={verify.isPending}>
          Verify
        </Button>

        <p className="text-center text-text-muted text-sm">
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={() => resend.mutate(email)}
            disabled={resend.isPending}
            className="text-brand-gold font-semibold hover:underline cursor-pointer disabled:opacity-50"
          >
            {resend.isPending ? "Sending…" : "Resend OTP"}
          </button>
        </p>
      </form>
    </div>
  );
}
