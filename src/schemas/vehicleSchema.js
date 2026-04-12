import { z } from "zod"

const currentYear = new Date().getFullYear()

export const step1Schema = z.object({
  manufacture: z
    .string()
    .min(1, "Manufacture is required")
    .refine(val => val.trim() !== "", "Cannot be empty spaces"),

  model: z
    .string()
    .min(1, "Model is required")
    .refine(val => val.trim() !== "", "Cannot be empty spaces"),

  year: z
    .number({ invalid_type_error: "Year must be a number" })
    .int("Year must be a whole number")
    .min(1886, "Year must be 1886 or later")
    .max(currentYear + 1, `Year cannot exceed ${currentYear + 1}`),

  vehicleType: z.enum(
    ["ELECTRIC", "SUV", "TRUCK", "MOTORCYCLE", "BUS", "VAN", "PICKUP", "OTHER"],
    { errorMap: () => ({ message: "Please select a valid vehicle type" }) }
  ),

  bodyType: z
    .string()
    .min(1, "Body type is required")
    .refine(val => val.trim() !== "", "Cannot be empty spaces"),

  color: z
    .string()
    .min(1, "Color is required")
    .refine(val => val.trim() !== "", "Cannot be empty spaces"),

  fuelType: z.enum(
    ["PETROL", "DIESEL", "ELECTRIC", "HYBRID", "GAS", "OTHER"],
    { errorMap: () => ({ message: "Please select a valid fuel type" }) }
  ),

  engineCapacity: z
    .number({ invalid_type_error: "Engine capacity must be a number" })
    .int("Must be a whole number")
    .min(1, "Engine capacity must be greater than 0"),

  odometerReading: z
    .number({ invalid_type_error: "Odometer reading must be a number" })
    .int("Must be a whole number")
    .min(0, "Odometer reading cannot be negative"),

  seatingCapacity: z
    .number({ invalid_type_error: "Seating capacity must be a number" })
    .int("Must be a whole number")
    .min(1, "Seating capacity must be at least 1"),

  vehiclePurpose: z.enum(
    ["PERSONAL", "COMMERCIAL", "TAXI", "GOVERNMENT"],
    { errorMap: () => ({ message: "Please select a valid purpose" }) }
  ),

  vehicleStatus: z.enum(
    ["NEW", "USED", "REBUILT"],
    { errorMap: () => ({ message: "Please select a valid status" }) }
  ),
})

export const step2Schema = z.object({
  ownerName: z
    .string()
    .min(1, "Owner name is required")
    .refine(val => val.trim() !== "", "Cannot be empty spaces"),

  ownerType: z.enum(
    ["INDIVIDUAL", "COMPANY", "NGO", "GOVERNMENT"],
    { errorMap: () => ({ message: "Please select a valid owner type" }) }
  ),

  nationalId: z
    .string()
    .regex(/^\d{16}$/, "National ID must be exactly 16 digits"),

  passportNumber: z
    .string()
    .optional()
    .refine(
      val => val === undefined || val === "" || val.trim() !== "",
      "Passport number cannot be empty spaces"
    ),

  companyRegNumber: z.string().optional(),

  address: z
    .string()
    .min(1, "Address is required")
    .refine(val => val.trim() !== "", "Cannot be empty spaces"),

  mobile: z
    .string()
    .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),

  email: z
    .string()
    .email("Please enter a valid email address"),

}).refine(
  (data) => {
    if (data.ownerType === "COMPANY") {
      return data.companyRegNumber && data.companyRegNumber.trim() !== ""
    }
    return true
  },
  {
    message: "Company registration number is required for COMPANY owner type",
    path: ["companyRegNumber"]
  }
)

export const step3Schema = z.object({
  plateNumber: z
    .string()
    .regex(
      /^(R[A-Z]{2}|GR|CD)\s?\d{3}\s?[A-Z]?$/i,
      "Invalid Rwandan plate number (e.g. RAB 123 A)"
    ),

  plateType: z.enum(
    ["PRIVATE", "COMMERCIAL", "GOVERNMENT", "DIPLOMATIC", "PERSONALIZED"],
    { errorMap: () => ({ message: "Please select a valid plate type" }) }
  ),

  registrationDate: z
    .string()
    .min(1, "Registration date is required"),

  expiryDate: z
    .string()
    .min(1, "Expiry date is required")
    .refine(
      val => new Date(val) > new Date(),
      "Expiry date cannot be in the past"
    ),

  registrationStatus: z.enum(
    ["ACTIVE", "SUSPENDED", "EXPIRED", "PENDING"],
    { errorMap: () => ({ message: "Please select a valid status" }) }
  ),

  state: z
    .string()
    .min(1, "State is required"),

  policyNumber: z
    .string()
    .min(1, "Policy number is required"),

  companyName: z
    .string()
    .min(1, "Insurance company name is required"),

  insuranceType: z
    .string()
    .min(1, "Insurance type is required"),

  insuranceExpiryDate: z
    .string()
    .min(1, "Insurance expiry date is required")
    .refine(
      val => new Date(val) > new Date(),
      "Insurance expiry date cannot be in the past"
    ),

  insuranceStatus: z.enum(
    ["ACTIVE", "SUSPENDED", "EXPIRED"],
    { errorMap: () => ({ message: "Please select a valid insurance status" }) }
  ),

  roadworthyCert: z
    .string()
    .min(1, "Roadworthy certificate is required"),

  customsRef: z
    .string()
    .min(1, "Customs reference is required"),

  proofOfOwnership: z
    .string()
    .min(1, "Proof of ownership is required"),
})