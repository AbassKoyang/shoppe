import z from "zod";
import { ProductSchema } from "./schema";

export type ProductType = z.infer<typeof ProductSchema>;