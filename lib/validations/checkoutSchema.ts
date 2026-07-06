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
  cardNumber: z
    .string()
    .regex(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/, "Please enter a valid 16-digit card number")
    .optional()
    .or(z.literal("")),
  cardExpiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Please enter expiry as MM/YY")
    .optional()
    .or(z.literal("")),
  cardCvv: z
    .string()
    .regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits")
    .optional()
    .or(z.literal("")),
  paymentMethod: z.enum(["card", "eft"]).optional().default("card"),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema> & {
  paymentMethod: "card" | "eft";
};

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
