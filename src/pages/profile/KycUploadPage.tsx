import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { Card, Button, Input } from "../../components";
import {
  Info,
  Camera,
  UserCheck,
  Upload,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { useSubmitKycMutation, useMyKycQuery } from "../../hooks/useKyc";
import { useAppStore } from "../../store/useAppStore";
import { KycUploadSkeleton } from "../../components/ChineseSkeleton";
import toast from "react-hot-toast";

const ID_TYPES = [
  { id: "national_id", name: "Philippine National ID (PhilSys)" },
  { id: "passport", name: "Passport" },
  { id: "drivers_license", name: "Driver's License" },
  { id: "sss", name: "SSS ID" },
  { id: "philhealth", name: "PhilHealth ID" },
  { id: "postal", name: "Postal ID" },
];

// ─── Status Screens ───────────────────────────────────────────────────────────

function PendingScreen() {
  return (
    <div className="space-y-4">
      <div className="chinese-header">
        <h1 className="text-xl font-extrabold text-text-primary">KYC Verification</h1>
      </div>
      <Card bento delay={100} className="lantern-card border-brand-gold/20" ornate>
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <Clock className="w-12 h-12 text-brand-gold" />
          <h2 className="text-lg font-bold text-text-primary">Under Review</h2>
          <p className="text-sm text-text-muted">
            Your documents have been submitted and are being reviewed. This usually
            takes up to <span className="text-text-primary font-medium">24 hours</span>.
          </p>
        </div>
      </Card>
      <Link to="/profile">
        <Button variant="outline" fullWidth>
          <ArrowLeft className="w-4 h-4 inline mr-1" /> Back to Profile
        </Button>
      </Link>
    </div>
  );
}

function ApprovedScreen() {
  return (
    <div className="space-y-4">
      <div className="chinese-header">
        <h1 className="text-xl font-extrabold text-text-primary">KYC Verification</h1>
      </div>
      <Card bento delay={100} className="lantern-card border-brand-green/20" ornate>
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <CheckCircle className="w-12 h-12 text-brand-green-light" />
          <h2 className="text-lg font-bold text-text-primary">Identity Verified</h2>
          <p className="text-sm text-text-muted">
            Your identity has been verified. You have full access to all features.
          </p>
        </div>
      </Card>
      <Link to="/profile">
        <Button variant="outline" fullWidth>
          <ArrowLeft className="w-4 h-4 inline mr-1" /> Back to Profile
        </Button>
      </Link>
    </div>
  );
}

// ─── Upload Form ──────────────────────────────────────────────────────────────

function UploadForm({ isResubmit, notes }: { isResubmit?: boolean; notes?: string | null }) {
  const navigate = useNavigate();
  const [idType, setIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [idFront, setIdFront] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const submitKyc = useSubmitKycMutation();

  const handleSubmit = () => {
    if (!idType) { toast.error("Select an ID type"); return; }
    if (!idNumber.trim()) { toast.error("Enter your ID number"); return; }
    if (!idFront) { toast.error("Upload front of your ID"); return; }
    if (!selfie) { toast.error("Upload a selfie with your ID"); return; }

    submitKyc.mutate(
      { idType: `${idType}:${idNumber}`, idFront, selfie },
      { onSuccess: () => navigate("/profile") },
    );
  };

  return (
    <div className="space-y-4">
      <div className="chinese-header">
        <h1 className="text-xl font-extrabold text-text-primary">
          {isResubmit ? "Resubmit KYC" : "KYC Verification"}
        </h1>
        <p className="text-text-muted text-sm">
          {isResubmit
            ? "Upload new documents to replace your previous submission"
            : "Verify your identity to unlock all features"}
        </p>
      </div>

      {/* Rejection / more-info notice */}
      {isResubmit && notes && (
        <Card bento delay={50} className="border-brand-red/20">
          <div className="flex items-start gap-2">
            <XCircle className="w-4 h-4 text-brand-red-light shrink-0 mt-0.5" />
            <p className="text-xs text-text-secondary">
              <span className="font-medium text-text-primary">Admin note: </span>
              {notes}
            </p>
          </div>
        </Card>
      )}

      {/* Info Card */}
      <Card bento delay={100} className="lantern-card border-brand-gold/20" ornate>
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-brand-gold shrink-0" />
          <div className="text-xs text-text-secondary space-y-1">
            <p>
              Documents are processed within{" "}
              <span className="text-text-primary font-medium">24 hours</span>.
            </p>
            <p>Ensure your ID is clear and readable.</p>
            <p>Your selfie must clearly show your face holding the ID.</p>
          </div>
        </div>
      </Card>

      {/* ID Type */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">
          ✦ Government ID Type
        </label>
        <select
          value={idType}
          onChange={(e) => setIdType(e.target.value)}
          className="w-full bg-surface-card border border-brand-gold/20 rounded-xl px-3 py-2.5 text-text-primary text-sm focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none"
        >
          <option value="">Select ID type</option>
          {ID_TYPES.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      {/* ID Number */}
      <Input
        label="✦ ID Number"
        placeholder="Enter your ID number"
        value={idNumber}
        onChange={(e) => setIdNumber(e.target.value)}
      />

      {/* ID Photo Upload */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">
          ✦ Front of ID
        </label>
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-brand-gold/20 rounded-xl cursor-pointer hover:border-brand-gold/40 transition-colors bg-surface-card">
          {idFront ? (
            <div className="text-center">
              <p className="text-brand-green text-sm font-medium">✓ {idFront.name}</p>
              <p className="text-xs text-text-muted mt-1">
                {(idFront.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div className="text-center">
              <Camera className="w-8 h-8 text-text-muted mx-auto mb-1" />
              <p className="text-xs text-text-muted">Tap to upload (JPG, PNG · Max 5MB)</p>
            </div>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => setIdFront(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>

      {/* Selfie Upload */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">
          ✦ Selfie with ID
        </label>
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-brand-gold/20 rounded-xl cursor-pointer hover:border-brand-gold/40 transition-colors bg-surface-card">
          {selfie ? (
            <div className="text-center">
              <p className="text-brand-green text-sm font-medium">✓ {selfie.name}</p>
              <p className="text-xs text-text-muted mt-1">
                {(selfie.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div className="text-center">
              <UserCheck className="w-8 h-8 text-text-muted mx-auto mb-1" />
              <p className="text-xs text-text-muted">Tap to take photo or upload</p>
            </div>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            capture="user"
            className="hidden"
            onChange={(e) => setSelfie(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>

      <Button
        variant="primary"
        fullWidth
        isLoading={submitKyc.isPending}
        disabled={!idType || !idNumber || !idFront || !selfie || submitKyc.isPending}
        onClick={handleSubmit}
      >
        <Upload className="w-4 h-4 inline mr-1" />
        {isResubmit ? "Resubmit Documents" : "Submit for Verification"}
      </Button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function KycUploadPage() {
  const user = useAppStore((s) => s.user);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const { data: kyc, isLoading } = useMyKycQuery();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) return <KycUploadSkeleton />;

  // Use the full KYC record if loaded, fall back to user store summary
  const status = kyc?.status ?? user?.kyc?.status ?? null;

  if (status === "PENDING") return <PendingScreen />;
  if (status === "APPROVED") return <ApprovedScreen />;

  const isResubmit = status === "REJECTED" || status === "REQUIRES_MORE_INFO";

  // Show rejected/requires-more-info notice at the top of form
  const notes = kyc?.notes ?? null;

  if (isResubmit) {
    return (
      <div className="space-y-4">
        <Card bento delay={50} className="border-brand-red/20">
          <div className="flex items-start gap-3">
            {status === "REJECTED" ? (
              <XCircle className="w-5 h-5 text-brand-red-light shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-orange-400 shrink-0" />
            )}
            <div>
              <p className="text-sm font-semibold text-text-primary">
                {status === "REJECTED" ? "KYC Rejected" : "More Information Needed"}
              </p>
              {notes && (
                <p className="text-xs text-text-muted mt-0.5">{notes}</p>
              )}
            </div>
          </div>
        </Card>
        <UploadForm isResubmit notes={notes} />
      </div>
    );
  }

  return <UploadForm />;
}
