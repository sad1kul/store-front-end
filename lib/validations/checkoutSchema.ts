import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name is too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[\d\s\+\-\(\)]+$/, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter your delivery address"),
  city: z.string().min(2, "Please enter your city"),
  province: z.string().min(2, "Please select a province"),
  postalCode: z
    .string()
    .regex(/^\d{4}$/, "Postal code must be 4 digits"),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const SA_PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape",
];
