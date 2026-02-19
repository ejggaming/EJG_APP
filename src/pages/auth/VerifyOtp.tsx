import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components";
import toast from "react-hot-toast";

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Please enter the complete OTP");
      return;
    }

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      toast.success("Mobile number verified!");
      navigate("/login");
    } catch {
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    toast.success("OTP sent to your mobile number");
  };

  return (
    <div className="bg-surface-card rounded-2xl border border-gray-700/50 p-6">
      <h2 className="text-xl font-bold text-white mb-1">Verify Mobile</h2>
      <p className="text-gray-400 text-sm mb-6">
        Enter the 6-digit code sent to your mobile number
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center gap-3">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-14 rounded-lg bg-surface-elevated border border-gray-600 text-center text-xl font-bold text-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold focus:outline-none transition-colors"
            />
          ))}
        </div>

        <Button type="submit" fullWidth size="lg" isLoading={loading}>
          Verify
        </Button>

        <p className="text-center text-gray-400 text-sm">
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={handleResend}
            className="text-brand-gold font-semibold hover:underline cursor-pointer"
          >
            Resend OTP
          </button>
        </p>
      </form>
    </div>
  );
}
