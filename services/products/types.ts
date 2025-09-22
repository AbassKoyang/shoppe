import z from "zod";
import { ProductSchema } from "./schema";

export type ProductType = z.infer<typeof ProductSchema>;
export type CategoryType =
  | "Tops"
  | "Bottoms"
  | "Dresses"
  | "Outerwear"
  | "Shoes"
  | "Accessories"
  | "Bags"
  | "Underwear"
  | "Swimwear"
  | "Activewear"
  | "Other";