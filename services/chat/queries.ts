import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getAllChats, getArchivedChats, getBuyingChats, getChatData, getChatMessages, getSellingChats, getUserInfo } from "./api";
import { GetAllChatsReturnType, PageParam } from "./types";

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
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,     
      refetchOnMount: true,
    });
};

const PAGE_SIZE = 10;
export const useGetAllChats= (userId: string) => {
    return useInfiniteQuery<GetAllChatsReturnType, Error>({
      queryKey: ['chats', userId],
      queryFn: ({pageParam}) => getAllChats({pageParam, userId}),
      initialPageParam: null, 
      getNextPageParam: (lastPage: GetAllChatsReturnType) => {
      if (!lastPage.lastVisible || lastPage.documents.length < PAGE_SIZE) {
        return undefined;
      }
      return lastPage.lastVisible;
    },
    enabled: !!userId,
    });
};
export const useGetSellingChats = (userId: string) => {
    return useInfiniteQuery<GetAllChatsReturnType, Error>({
      queryKey: ['sellingChats', userId],
      queryFn: ({pageParam}) => getSellingChats({pageParam, userId}),
      initialPageParam: null, 
      getNextPageParam: (lastPage: GetAllChatsReturnType) => {
      if (!lastPage.lastVisible || lastPage.documents.length < PAGE_SIZE) {
        return undefined;
      }
      return lastPage.lastVisible;
    },
    enabled: !!userId,
    });
};
export const useGetBuyingChats= (userId: string) => {
    return useInfiniteQuery<GetAllChatsReturnType, Error>({
      queryKey: ['buyingChats', userId],
      queryFn: ({pageParam}) => getBuyingChats({pageParam, userId}),
      initialPageParam: null, 
      getNextPageParam: (lastPage: GetAllChatsReturnType) => {
      if (!lastPage.lastVisible || lastPage.documents.length < PAGE_SIZE) {
        return undefined;
      }
      return lastPage.lastVisible;
    },
    enabled: !!userId,
    });
};
export const useGetArchivedChats= (userId: string) => {
    return useInfiniteQuery<GetAllChatsReturnType, Error>({
      queryKey: ['archivedChats', userId],
      queryFn: ({pageParam}) => getArchivedChats({pageParam, userId}),
      initialPageParam: null, 
      getNextPageParam: (lastPage: GetAllChatsReturnType) => {
      if (!lastPage.lastVisible || lastPage.documents.length < PAGE_SIZE) {
        return undefined;
      }
      return lastPage.lastVisible;
    },
    enabled: !!userId,
    });
};