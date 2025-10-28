import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchPaymentMethods, getCompletedSales, getDeliveredOrders, getOrderById, getPendingOrders, getPendingSales, getTransactions } from "./api";
import { getTransactionsReturnType } from "./types";

export const usePaymentMethods = (userId: string) => {
    return useQuery({
      queryKey: ["paymentMethods", userId], 
      queryFn: () => fetchPaymentMethods(userId),
      enabled: !!userId, 
    });
};
export const useGetPendingOrders = (userId: string) => {
    return useQuery({
      queryKey: ["orders", userId], 
      queryFn: () => getPendingOrders(userId),
      enabled: !!userId, 
    });
};
export const useGetDeliveredOrders = (userId: string) => {
    return useQuery({
      queryKey: ["orders", userId], 
      queryFn: () => getDeliveredOrders(userId),
      enabled: !!userId, 
    });
};
export const useGetPendingSales = (userId: string) => {
    return useQuery({
      queryKey: ["sales", userId], 
      queryFn: () => getPendingSales(userId),
      enabled: !!userId, 
    });
};
export const useGetCompletedSales = (userId: string) => {
    return useQuery({
      queryKey: ["sales", userId], 
      queryFn: () => getCompletedSales(userId),
      enabled: !!userId, 
    });
};
export const useGetTransactions = (userId: string) => {
    return useInfiniteQuery<getTransactionsReturnType, Error>({
      queryKey: ["transactions", userId], 
      queryFn: ({pageParam}) => getTransactions({pageParam, userId}),
      initialPageParam: null, 
      getNextPageParam: (lastPage: getTransactionsReturnType) => {
      if (!lastPage.lastVisible || lastPage.orders.length < 10) {
        return undefined;
      }
    return lastPage.lastVisible;
  },
      enabled: !!userId, 
    });
};
export const useGetOrderById = (orderId: string) => {
    return useQuery({
      queryKey: ["orders", orderId], 
      queryFn: () => getOrderById(orderId),
      enabled: !!orderId, 
    });
};

