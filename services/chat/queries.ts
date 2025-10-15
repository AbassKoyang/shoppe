import { useQuery } from "@tanstack/react-query";
import { getAllChats, getChatData, getChatMessages, getUserInfo } from "./api";

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