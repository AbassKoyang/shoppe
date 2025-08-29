import z from "zod";
import { AppUserSchema, FirebaseUserSchema, UserSchema } from "./schema";

export type User = z.infer<typeof UserSchema>;
export type AppUser = z.infer<typeof AppUserSchema>;
export type FirebaseUser = z.infer<typeof FirebaseUserSchema>;