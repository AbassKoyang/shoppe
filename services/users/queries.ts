import { useQuery } from "@tanstack/react-query";
import { fetchCountry, fetchCurrency, fetchLanguage, fetchSize } from "@/services/users/api";

export const useFetchLanguage = (userId: string) => {
  return useQuery({
    queryKey: ["language", userId], // ✅ cache per user
    queryFn: () => fetchLanguage(userId),
    enabled: !!userId, // ✅ only fetch if userId exists
  });
};
export const useFetchCurrency = (userId: string) => {
  return useQuery({
    queryKey: ["currency", userId], // ✅ cache per user
    queryFn: () => fetchCurrency(userId),
    enabled: !!userId, // ✅ only fetch if userId exists
  });
};
export const useFetchSize = (userId: string) => {
  return useQuery({
    queryKey: ["size", userId], // ✅ cache per user
    queryFn: () => fetchSize(userId),
    enabled: !!userId, // ✅ only fetch if userId exists
  });
};
export const useFetchCountry = (userId: string) => {
  return useQuery({
    queryKey: ["country", userId], // ✅ cache per user
    queryFn: () => fetchCountry(userId),
    enabled: !!userId, // ✅ only fetch if userId exists
  });
};

