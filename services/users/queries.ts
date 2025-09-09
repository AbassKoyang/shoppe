import { useQuery } from "@tanstack/react-query";
import { fetchLanguage, fetchPaymentMethods } from "@/services/users/api";

export const usePaymentMethods = (userId: string) => {
  return useQuery({
    queryKey: ["paymentMethods", userId], // ✅ cache per user
    queryFn: () => fetchPaymentMethods(userId),
    enabled: !!userId, // ✅ only fetch if userId exists
  });
};
export const useFetchLanguage = (userId: string) => {
  return useQuery({
    queryKey: ["language", userId], // ✅ cache per user
    queryFn: () => fetchLanguage(userId),
    enabled: !!userId, // ✅ only fetch if userId exists
  });
};

