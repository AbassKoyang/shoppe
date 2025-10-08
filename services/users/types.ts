import z from "zod";
import { AppUserSchema, UserSchema } from "./schema";
import { ProductType } from "../products/types";

export type User = z.infer<typeof UserSchema>;
export type AppUserType = z.infer<typeof AppUserSchema>;
export type paymentMethodType =  {id?: string; userId: string; cardHolder: string; brand: string; last4: string; expiryDate: string; cvv: string; token: string; createdAt?: string;}
export type CountryType = {
    value: string;
    label: string;
}
// export type FirebaseUserType = z.infer<typeof FirebaseUserSchema>;