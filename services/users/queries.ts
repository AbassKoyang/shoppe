import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchCountry, fetchCurrency, fetchLanguage, fetchNotifications, fetchSize, fetchUserById } from "@/services/users/api";
import { fetchNotificationsReturnType } from "./types";

export const useFetchLanguage = (userId: string) => {
  return useQuery({
    queryKey: ["language", userId],
    queryFn: () => fetchLanguage(userId),
    enabled: !!userId, 
  });
};
export const useFetchUserById = (userId: string) => {
  return useQuery({
    queryKey: ["visitor-profile", userId],
    queryFn: () => fetchUserById(userId),
    enabled: !!userId, 
  });
};
export const useFetchCurrency = (userId: string) => {
  return useQuery({
    queryKey: ["currency", userId],
    queryFn: () => fetchCurrency(userId),
    enabled: !!userId, 
  });
};
export const useFetchSize = (userId: string) => {
  return useQuery({
    queryKey: ["size", userId],
    queryFn: () => fetchSize(userId),
    enabled: !!userId, 
  });
};
export const useFetchCountry = (userId: string) => {
  return useQuery({
    queryKey: ["country", userId],
    queryFn: () => fetchCountry(userId),
    enabled: !!userId, 
  });
};

const PAGE_SIZE = 10;
export const useFetchNotifications= (userId: string) => {
    return useInfiniteQuery<fetchNotificationsReturnType, Error>({
      queryKey: ['notifications', userId],
      queryFn: ({pageParam}) => fetchNotifications({pageParam, userId}),
      initialPageParam: null, 
      getNextPageParam: (lastPage: fetchNotificationsReturnType) => {
      if (!lastPage.lastVisible || lastPage.notifications.length < PAGE_SIZE) {
        return undefined;
      }
      return lastPage.lastVisible;
    },
    enabled: !!userId,
    });
};
