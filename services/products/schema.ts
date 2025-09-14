import { z } from "zod";

export const ProductSchema = z
  .object({
    id: z.string().min(1, "Product ID is required").optional(),
    sellerId: z.string().min(1, "Seller ID is required").optional(),
    title: z.string().min(1, "Product title is required"),
    description: z.string().min(1, "Description is required"),
    price: z.number().positive("Price must be > 0"),
    currency: z.union([z.literal("$ USD"), z.literal("€ EURO"), z.literal("₦ NGN")]),
    images: z.array(z.string().min(1, "At least one image is required")),
    category: z.literal(["Tops","Bottoms","Dresses","Outerwear","Shoes","Accessories","Bags","Underwear","Swimwear","Activewear","Other"]),
    condition: z.literal(["new", "used"]),
    size: z.union([
      z.literal(["One Size", "XS", "S", "M", "L", "XL", "XXL"]), // alpha + one size
      z.string().regex(/^\d+$/, "Numeric size must be digits only"), // numeric like 28, 30, 42...
    ]),
    gender: z.literal(["Men", "Women", "Unisex"]),
    brand: z.string().optional(),
    color: z.string().optional(),
    material: z.string().optional(),
    sku: z.string().optional(),
    tags: z.array(z.string()).optional(),
    location: z
      .object({
        country: z.string(),
        city: z.string(),
      })
      .optional(),
  });

export type Product = z.infer<typeof ProductSchema>;
