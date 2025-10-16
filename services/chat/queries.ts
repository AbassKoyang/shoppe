import { useQuery } from "@tanstack/react-query";
import { getAllChats, getBuyingChats, getChatData, getChatMessages, getSellingChats, getUserInfo } from "./api";

// export const useGetChatMessages= (chatId: string) => {
//     return useQuery({
//       queryKey: ["chat", chatId], 
//       queryFn: () => getChatMessages(chatId),
//       enabled: !!chatId,
//     });
// };
export const useGetChatData= (productId: string, userId: string, chatId: string) => {
    return useQuery({
      queryKey: ["chatData", userId], 
      queryFn: () => getChatData(productId, userId, chatId),
      enabled: !!userId,
    });
};
export const useGetAllChats= (userId: string) => {
    return useQuery({
      queryKey: ["chats", userId], 
      queryFn: () => getAllChats(userId),
      enabled: !!userId,
    });
};
export const useGetSellingChats= (userId: string) => {
    return useQuery({
      queryKey: ["chats", userId], 
      queryFn: () => getSellingChats(userId),
      enabled: !!userId,
    });
};
export const useGetBuyingChats= (userId: string) => {
    return useQuery({
      queryKey: ["chats", userId], 
      queryFn: () => getBuyingChats(userId),
      enabled: !!userId,
    });
};