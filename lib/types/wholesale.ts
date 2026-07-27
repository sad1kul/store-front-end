export type ApplicationStatus = "pending" | "approved" | "rejected";

export interface WholesaleApplication {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  cellphone?: string;
  businessType?: string;
  businessRegistration?: string;
  shopAddress?: string;
  shopCity?: string;
  shopPostalCode?: string;
  taxNumber?: string;
  estimatedMonthlySpend?: string;
  monthlyOrderValue?: string;
  notes?: string;
  submittedAt: string;
  appliedAt?: string;
  appliedDate?: string;
  status: ApplicationStatus;
  shopPhotos?: string[];
  approvedDate?: string;
  rejectedDate?: string;
  adminNotes?: string;
  rejectionReason?: string;
}
