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
 * Files are uploaded to Cloudinary on the backend.
 */
export const kycService = {
  submit: (data: {
    userId: string;
    documentType: string;
    documentFile: File;
    selfieFile?: File;
  }) => {
    const formData = new FormData();
    formData.append("userId", data.userId);
    formData.append("documentType", data.documentType);
    formData.append("documentFile", data.documentFile);
    if (data.selfieFile) {
      formData.append("selfieFile", data.selfieFile);
    }

    return apiClient.post<ApiSuccess<KycRecord>>("/kyc", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  list: (params?: Record<string, string>) =>
    apiClient.get<
      ApiSuccess<{ kycs: KycRecord[]; count: number; pagination?: unknown }>
    >("/kyc", { params: { document: "true", count: "true", ...params } }),

  update: (
    id: string,
    data: { status: KycStatus; reviewedBy?: string; notes?: string },
  ) => apiClient.patch<ApiSuccess<{ kyc: KycRecord }>>(`/kyc/${id}`, data),
};
