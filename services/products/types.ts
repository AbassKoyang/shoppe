import z from "zod";
import { ProductSchema, recentlyViewedProductSchema } from "./schema";

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

  export type WishlistType = {
    id?: string;
    userId: string;
    product: ProductType;
}
export type recentlyViewedType = z.infer<typeof recentlyViewedProductSchema>