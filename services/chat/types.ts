import { DocumentSnapshot } from "@google-cloud/firestore";
import { ProductType } from "../products/types";
import { AppUserType } from "../users/types";

export type messageType = {
    id?: string;
    senderId: string;
    text: string;
    images?: string[];
    timestamp?: any;
    edited?: boolean;
}
export type chatType = {
    id?: string;
    createdAt: any;
    productId: string;
    buyerId: string;
    sellerId: string;
    messages: messageType[];
    participants: AppUserType[];
    archived?: boolean;
}
export type ChatDataType = {
    userInfo: AppUserType;
    chatMessages: messageType[];
    productDetails: ProductType;
    chatDetails: chatType;
}
export type PageParam = unknown;

export interface GetAllChatsParamsType {
  pageParam: PageParam;
  userId: string;
}
export interface GetAllChatsReturnType {
  documents: chatType[],
  lastVisible: any,
}