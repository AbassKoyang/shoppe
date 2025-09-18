import { useQuery } from "@tanstack/react-query";
import { fetchProductCategoryCount } from "./api";

export const useFetchProductCategoryCount = (label: string) => {
    return useQuery({
      queryKey: ["productsCount", label], // ✅ cache per user
      queryFn: () => fetchProductCategoryCount(label),
      enabled: !!label, // ✅ only fetch if userId exists
    });
  };