import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Input } from "../../components";
import { useAppStore } from "../../store/useAppStore";
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
  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);
  const [idType, setIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [idFront, setIdFront] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!idType) {
      toast.error("Select an ID type");
      return;
    }
    if (!idNumber.trim()) {
      toast.error("Enter your ID number");
      return;
    }
    if (!idFront) {
      toast.error("Upload front of your ID");
      return;
    }
    if (!selfie) {
      toast.error("Upload a selfie with your ID");
      return;
    }

    setIsSubmitting(true);
    // Mock API call
    await new Promise((r) => setTimeout(r, 2000));

    if (user) {
      setUser({ ...user, kycStatus: "pending" });
    }

    toast.success("KYC documents submitted for review!");
    setIsSubmitting(false);
    navigate("/profile");
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-white">KYC Verification</h1>
        <p className="text-gray-400 text-sm">
          Verify your identity to unlock all features
        </p>
      </div>

      {/* Steps */}
      <Card className="border border-brand-gold/20">
        <div className="flex items-start gap-3">
          <span className="text-xl">ℹ️</span>
          <div className="text-xs text-gray-400 space-y-1">
            <p>
              Documents are processed within{" "}
              <span className="text-white">24 hours</span>.
            </p>
            <p>Ensure your ID is clear and readable.</p>
            <p>Your selfie must clearly show your face holding the ID.</p>
          </div>
        </div>
      </Card>

      {/* ID Type */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Government ID Type
        </label>
        <select
          value={idType}
          onChange={(e) => setIdType(e.target.value)}
          className="w-full bg-surface-elevated border border-gray-600 rounded-lg px-3 py-2.5 text-white text-sm focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none"
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
        label="ID Number"
        placeholder="Enter your ID number"
        value={idNumber}
        onChange={(e) => setIdNumber(e.target.value)}
      />

      {/* ID Photo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Front of ID
        </label>
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-brand-red transition-colors bg-surface-elevated">
          {idFront ? (
            <div className="text-center">
              <p className="text-brand-green text-sm font-medium">
                ✓ {idFront.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {(idFront.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div className="text-center">
              <svg
                className="w-8 h-8 text-gray-400 mx-auto mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-xs text-gray-400">
                Tap to upload (JPG, PNG · Max 5MB)
              </p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setIdFront(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>

      {/* Selfie Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Selfie with ID
        </label>
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-brand-red transition-colors bg-surface-elevated">
          {selfie ? (
            <div className="text-center">
              <p className="text-brand-green text-sm font-medium">
                ✓ {selfie.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {(selfie.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div className="text-center">
              <svg
                className="w-8 h-8 text-gray-400 mx-auto mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p className="text-xs text-gray-400">
                Tap to take photo or upload
              </p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            capture="user"
            className="hidden"
            onChange={(e) => setSelfie(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>

      <Button
        variant="primary"
        fullWidth
        isLoading={isSubmitting}
        disabled={!idType || !idNumber || !idFront || !selfie}
        onClick={handleSubmit}
      >
        Submit for Verification
      </Button>
    </div>
  );
}
