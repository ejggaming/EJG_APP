import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Input } from "../../components";
import { Info, Camera, UserCheck, Upload } from "lucide-react";
import { useSubmitKycMutation } from "../../hooks/useKyc";
import toast from "react-hot-toast";

const ID_TYPES = [
  { id: "national_id", name: "Philippine National ID (PhilSys)" },
  { id: "passport", name: "Passport" },
  { id: "drivers_license", name: "Driver's License" },
  { id: "sss", name: "SSS ID" },
  { id: "philhealth", name: "PhilHealth ID" },
  { id: "postal", name: "Postal ID" },
];

export default function KycUploadPage() {
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
          KYC Verification
        </h1>
        <p className="text-text-muted text-sm">
          Verify your identity to unlock all features
        </p>
      </div>

      {/* Info Card */}
      <Card
        bento
        delay={100}
        className="lantern-card border-brand-gold/20"
        ornate
      >
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
              <p className="text-brand-green text-sm font-medium">
                ✓ {idFront.name}
              </p>
              <p className="text-xs text-text-muted mt-1">
                {(idFront.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div className="text-center">
              <Camera className="w-8 h-8 text-text-muted mx-auto mb-1" />
              <p className="text-xs text-text-muted">
                Tap to upload (JPG, PNG · Max 5MB)
              </p>
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
              <p className="text-brand-green text-sm font-medium">
                ✓ {selfie.name}
              </p>
              <p className="text-xs text-text-muted mt-1">
                {(selfie.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div className="text-center">
              <UserCheck className="w-8 h-8 text-text-muted mx-auto mb-1" />
              <p className="text-xs text-text-muted">
                Tap to take photo or upload
              </p>
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
        <Upload className="w-4 h-4 inline mr-1" /> Submit for Verification
      </Button>
    </div>
  );
}
