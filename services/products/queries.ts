import { useQuery } from "@tanstack/react-query";
import { fetchProductCategoryCount, fetchProductsByCategory } from "./api";
import { useSearchParams } from "next/navigation";

export const useFetchProductCategoryCount = (label: string) => {
  
    return useQuery({
      queryKey: ["productsCount", label], // ✅ cache per user
      queryFn: () => fetchProductCategoryCount(label),
      enabled: !!label, // ✅ only fetch if userId exists
    });
  };
export const useFetchProductByCategory = (category: string) => {
  const searchParams = useSearchParams();

  // Build filters object from URL
  const filters: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    filters[key] = value;
  });
  console.log('Filters:', filters, category);
    return useQuery({
      queryKey: ["productsByCategory", category], // ✅ cache per user
      queryFn: () => fetchProductsByCategory(category, filters),
      enabled: !!category, // ✅ only fetch if userId exists
    });
  };