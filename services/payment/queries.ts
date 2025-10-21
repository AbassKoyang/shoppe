import { useQuery } from "@tanstack/react-query";
import { fetchPaymentMethods, getDeliveredOrders, getOrderById, getPendingOrders } from "./api";

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
export const useGetOrderById = (orderId: string) => {
    return useQuery({
      queryKey: ["orders", orderId], 
      queryFn: () => getOrderById(orderId),
      enabled: !!orderId, 
    });
};