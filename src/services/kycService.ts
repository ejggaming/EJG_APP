import apiClient from "./apiClient";

export type KycStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "REQUIRES_MORE_INFO";

export interface KycRecord {
  id: string;
  userId: string;
  status: KycStatus;
  documentType: string;
  documentUrl: string;
  selfieUrl?: string | null;
  notes?: string | null;
  reviewedBy?: string | null;
  submittedAt?: string | null;
  reviewedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiSuccess<T> {
  status: "success";
  message: string;
  data?: T;
  code: number;
  timestamp: string;
}

/**
 * Submit KYC using multipart/form-data.
 * userId is taken from the JWT on the backend — do NOT send it in the body.
 * Files are uploaded to Cloudinary on the backend.
 */
export const kycService = {
  submit: (data: {
    documentType: string;
    documentFile: File;
    selfieFile?: File;
  }) => {
    const formData = new FormData();
    formData.append("documentType", data.documentType);
    formData.append("documentFile", data.documentFile);
    if (data.selfieFile) {
      formData.append("selfieFile", data.selfieFile);
    }

    return apiClient.post<ApiSuccess<KycRecord>>("/kyc", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  /** Get the current authenticated user's own KYC record */
  getMyKyc: () =>
    apiClient.get<ApiSuccess<{ kyc: KycRecord | null }>>("/kyc/me"),

  list: (params?: Record<string, string>) =>
    apiClient.get<
      ApiSuccess<{ kycs: KycRecord[]; count: number; pagination?: unknown }>
    >("/kyc", { params: { document: "true", count: "true", ...params } }),

  update: (
    id: string,
    data: { status: KycStatus; reviewedBy?: string; notes?: string },
  ) => apiClient.patch<ApiSuccess<{ kyc: KycRecord }>>(`/kyc/${id}`, data),
};
