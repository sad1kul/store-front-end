import { z } from "zod";

// step 1 - business details
export const businessDetailsBaseSchema = z.object({
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters")
    .max(100, "Business name is too long"),
  ownerName: z
    .string()
    .min(2, "Your full name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Please enter a valid business email address"),
  cellphone: z
    .string()
    .min(10, "Cellphone number must be at least 10 digits")
    .max(15, "Cellphone number is too long")
    .regex(
      /^(\+27|0)[6-8][0-9]{8}$/,
      "Enter a valid SA cellphone number (e.g. 082 123 4567)"
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  businessRegistration: z
    .string()
    .max(50, "Registration number is too long")
    .optional()
    .or(z.literal("")),
  businessType: z.literal("Wholesaler", {
    message: "Only Wholesalers can apply at this time",
  }),
  monthlyOrderValue: z
    .string()
    .min(1, "Please select your expected monthly order value"),
});

export const businessDetailsSchema = businessDetailsBaseSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
);

// step 2 - shop location
export const shopDetailsSchema = z.object({
  shopAddress: z
    .string()
    .min(10, "Please enter your full shop street address")
    .max(300, "Address is too long"),
  shopCity: z.string().min(2, "Please enter your city or town"),
  shopProvince: z.string().min(2, "Please select your province"),
  shopPostalCode: z.string().regex(/^\d{4}$/, "Postal code must be 4 digits"),
  yearsInBusiness: z.enum(
    ["Less than 1 year", "1–2 years", "3–5 years", "5–10 years", "10+ years"] as const,
    { message: "Please select how long you've been in business" }
  ),
  taxNumber: z.string().max(20, "Tax number is too long").optional().or(z.literal("")),
  referral: z.string().max(200, "Too long").optional().or(z.literal("")),
});

// step 3 - terms
export const termsSchema = z.object({
  agreedToTerms: z.literal(true, {
    message: "You must agree to the Terms & Conditions to proceed",
  }),
  agreedToAge: z.literal(true, {
    message: "You must confirm you are 18 years or older",
  }),
  agreedToCompliance: z.literal(true, {
    message: "You must confirm your business complies with tobacco legislation",
  }),
});

export const wholesaleSchema = businessDetailsBaseSchema
  .merge(shopDetailsSchema)
  .merge(termsSchema)
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type BusinessDetailsData = z.infer<typeof businessDetailsSchema>;
export type ShopDetailsData = z.infer<typeof shopDetailsSchema>;
export type TermsData = z.infer<typeof termsSchema>;
export type WholesaleFormData = z.infer<typeof wholesaleSchema>;

export const BUSINESS_TYPES = [
  "Retailer",
  "Reseller",
  "Spaza Shop",
  "Wholesaler",
  "Other",
] as const;

export const MONTHLY_ORDER_VALUES = [
  "Under R 5,000",
  "R 5,000 – R 10,000",
  "R 10,000 – R 20,000",
  "R 20,000 – R 50,000",
  "R 50,000 – R 100,000",
  "R 100,000+",
];

export const YEARS_IN_BUSINESS = [
  "Less than 1 year",
  "1–2 years",
  "3–5 years",
  "5–10 years",
  "10+ years",
];

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
