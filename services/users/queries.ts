import { useQuery } from "@tanstack/react-query";
import { fetchCountry, fetchCurrency, fetchLanguage, fetchSize, fetchUserById } from "@/services/users/api";

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

