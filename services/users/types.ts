import z from "zod";
import { AppUserSchema, UserSchema } from "./schema";

export type User = z.infer<typeof UserSchema>;
export type AppUserType = z.infer<typeof AppUserSchema>;
// export type FirebaseUserType = z.infer<typeof FirebaseUserSchema>;