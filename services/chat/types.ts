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
}
export type ChatDataType = {
    userInfo: AppUserType;
    chatMessages: messageType[];
    productDetails: ProductType;
    chatDetails: chatType;
}