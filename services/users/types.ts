import z from "zod";
import { AppUserSchema, UserSchema } from "./schema";
import { ProductType } from "../products/types";

export type User = z.infer<typeof UserSchema>;
export type AppUserType = z.infer<typeof AppUserSchema>;
export type CountryType = {
    value: string;
    label: string;
}
export type NotificationType = {
    id?: string;
    type: string;
    title: string;
    body: string;
    link: string;
    isRead: boolean;
    createdAt: number;
    userId: string;
}
export type PageParam = unknown;

export interface fetchNotificationsParamsType {
  pageParam: PageParam;
  userId: string;
}
export interface fetchNotificationsReturnType {
  notifications: NotificationType[],
  lastVisible: any,
}