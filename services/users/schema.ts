import z, { } from "zod";
export const UserSchema = z.object({
    role: z.literal(["buyer", "vendor", "admin"]),
    profile: z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email format"),
      imageUrl: z.string().url().optional(),
      language: z.literal(['English', 'Français'])
    }),
    shopPrefrences: z.object({
        country: z.literal(['Nigeria', 'USA', 'Spain']),
        currency: z.literal(['$ USD', '€ EURO', '₦ NGN']),
        size: z.literal(['US', 'UK', 'EU']),
    }),
    shippingAddress: z.object({
      country: z.string(),
      city: z.string(),
      address: z.string(),
      postalCode: z.string(),
      phoneNumber: z.string(),
    }),
    createdAt: z.iso.datetime(), // Firestore Timestamp
    updatedAt: z.iso.datetime(),
  });

export const AppUserSchema = z.object({
      uid: z.string().min(1, "Uid is required"),
      role: z.literal(["buyer", "vendor", "admin"]),
      profile: z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email format"),
      imageUrl: z.string().url().optional(),
      language: z.literal(['English', 'Français'])
    }),
    shopPrefrences: z.object({
      country: z.literal(['Nigeria', 'USA', 'Spain']),
      currency: z.literal(['$ USD', '€ EURO', '₦ NGN']),
      size: z.literal(['US', 'UK', 'EU']),
    }),
    shippingAddress: z.object({
      country: z.string(),
      city: z.string(),
      address: z.string(),
      postalCode: z.string(),
      phoneNumber: z.string(),
    }),
    createdAt: z.iso.datetime(), // Firestore Timestamp
    updatedAt: z.iso.datetime(),
  });

  // export const FirebaseUserSchema = z.object({
  //   uid: z.string().min(1, "Uid is required"),
  //   email: z.string().min(1, "email is required").nullable(),
  // })