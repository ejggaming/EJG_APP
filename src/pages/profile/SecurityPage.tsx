import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card, Button } from "../../components";
import { ArrowLeft, KeyRound, ShieldCheck, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function SecurityPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({ current: "", newPass: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPass !== form.confirm) {
      toast.error("New passwords don't match");
      return;
    }
    if (form.newPass.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    // TODO: wire to change password API
    setTimeout(() => {
      setLoading(false);
      toast.success("Password changed successfully");
      setForm({ current: "", newPass: "", confirm: "" });
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/profile/${id}`)}
          className="p-2 rounded-full bg-surface-card border border-brand-gold/10 hover:border-brand-gold/30 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-text-muted" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-text-primary chinese-header">Security</h1>
          <p className="text-xs text-text-muted">Password & account protection</p>
        </div>
      </div>

      {/* Change Password */}
      <Card bento className="lantern-card">
        <div className="flex items-center gap-2 mb-4">
          <KeyRound className="w-5 h-5 text-brand-gold" />
          <h2 className="text-sm font-bold text-text-primary">Change Password</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          {[
            { label: "Current Password", field: "current", show: showCurrent, toggle: () => setShowCurrent((v) => !v) },
            { label: "New Password", field: "newPass", show: showNew, toggle: () => setShowNew((v) => !v) },
            { label: "Confirm New Password", field: "confirm", show: showConfirm, toggle: () => setShowConfirm((v) => !v) },
          ].map(({ label, field, show, toggle }) => (
            <div key={field}>
              <label className="block text-xs text-text-muted mb-1">{label}</label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={form[field as keyof typeof form]}
                  onChange={handleChange(field)}
                  className="w-full bg-surface-card border border-brand-gold/15 rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-brand-gold/40 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={toggle}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
          <Button type="submit" variant="primary" fullWidth isLoading={loading} className="mt-1">
            Update Password
          </Button>
        </form>
      </Card>

      {/* 2FA placeholder */}
      <Card bento className="lantern-card">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-brand-gold" />
          <div className="flex-1">
            <p className="text-sm font-medium text-text-primary">Two-Factor Authentication</p>
            <p className="text-xs text-text-muted">Coming soon — extra layer of security</p>
          </div>
          <span className="text-xs bg-brand-gold/10 text-brand-gold px-2 py-0.5 rounded-full font-semibold">Soon</span>
        </div>
      </Card>
    </div>
  );
}
