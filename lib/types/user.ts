import { UserRole, BulkStatus } from "@/lib/store/authStore";

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  joinedDate?: string;
  status?: string;
  bulkStatus?: BulkStatus;
  businessName?: string;
  businessType?: string;
  totalOrders?: number;
  totalSpent?: number;
  bulkSavings?: number;
}
