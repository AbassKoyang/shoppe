import { useQuery } from "@tanstack/react-query";
import { fetchProductCategoryCount, fetchProductPerUser, fetchProductsByCategory, fetchProductsBySubCategory, fetchSingleProduct, fetchUserWishlist, isProductInWishlist, searchProductsIndex } from "./api";
import { useSearchParams } from "next/navigation";
import { ProductType } from "./types";

export const useFetchProductCategoryCount = (label: string) => {
  
    return useQuery({
      queryKey: ["productsCount", label], // ✅ cache per user
      queryFn: () => fetchProductCategoryCount(label),
      enabled: !!label,
    });
  };


export const useFetchProductByCategory = (category: string) => {
  const searchParams = useSearchParams();
  const filters: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    filters[key] = value;
  });
  console.log('Filters:', filters, category);
    return useQuery({
      queryKey: ["productsByCategory", category, filters],
      queryFn: () => fetchProductsByCategory(category, filters),
      enabled: !!category,
      placeholderData: true,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,     
      refetchOnMount: false,         
      staleTime: 1000 * 60 * 5,
    });
  };
export const useFetchProductBySubCategory = (subCategory: string) => {
  const searchParams = useSearchParams();
  const filters: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    filters[key] = value;
  });
  console.log('Filters:', filters, subCategory);
    return useQuery({
      queryKey: ["productsBySubCategory", subCategory, filters],
      queryFn: () => fetchProductsBySubCategory(subCategory, filters),
      enabled: !!subCategory,
      placeholderData: true,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,     
      refetchOnMount: false,         
      staleTime: 1000 * 60 * 5,
    });
  };


export const useSearchProductsIndex = (query: string) => {
  const searchParams = useSearchParams();
  const filters: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    filters[key] = value;
  });
  console.log('Filters:', filters, )
    return useQuery({
      queryKey: ["products" ,filters, query],
      queryFn: () => searchProductsIndex(query, filters),
      enabled: !!filters,      placeholderData: true,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,     
      refetchOnMount: false,         
      staleTime: 1000 * 60 * 5,
    });
  };

  export const useFetchSingleProduct = (id: string) => {
    return useQuery({
      queryKey: ["product", id], 
      queryFn: () => fetchSingleProduct(id),
      enabled: !!id,
    });
  };
  export const useFetchProductPerUser = (id: string) => {
    return useQuery({
      queryKey: ["productPerUser", id], 
      queryFn: () => fetchProductPerUser(id),
      enabled: !!id,
    });
  };
  export const useFetchUserWishlist = (userId: string) => {
    return useQuery({
      queryKey: ["wishlists", userId], 
      queryFn: () => fetchUserWishlist(userId),
      enabled: !!userId,
    });
  };