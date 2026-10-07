export type ApplicationStatus = "pending" | "approved" | "rejected";

export interface WholesaleApplication {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  password?: string;
  cellphone?: string;
  phone?: string;
  businessType?: string;
  businessRegistration?: string;
  shopAddress?: string;
  shopCity?: string;
  shopProvince?: string;
  shopPostalCode?: string;
  taxNumber?: string;
  estimatedMonthlySpend?: string;
  monthlyOrderValue?: string;
  notes?: string;
  submittedAt?: string;
  appliedAt?: string;
  appliedDate?: string;
  status: ApplicationStatus;
  shopPhotos?: string[];
  approvedDate?: string;
  rejectedDate?: string;
  adminNotes?: string;
  rejectionReason?: string;
}
