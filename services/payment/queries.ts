import { useQuery } from "@tanstack/react-query";
import { fetchPaymentMethods } from "./api";

export const usePaymentMethods = (userId: string) => {
    return useQuery({
      queryKey: ["paymentMethods", userId], // ✅ cache per user
      queryFn: () => fetchPaymentMethods(userId),
      enabled: !!userId, // ✅ only fetch if userId exists
    });
  };