import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchProductCategoryCount, fetchProductPerUser, fetchProductsByCategory, fetchProductsBySubCategory, fetchSingleProduct, fetchUserWishlist, getNewProducts, getPersonalizedProducts, getPopularProducts, getRecentlyViewed, getTopProducts, getViewedToday, getViewedYesterday, isProductInWishlist, searchProductsIndex } from "./api";
import { useSearchParams } from "next/navigation";
import { fetchNewProductsReturnType, ProductType } from "./types";

export const useFetchProductCategoryCount = (label: string) => {
  
    return useQuery({
      queryKey: ["productsCount", label],
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
  export const useGetViewedToday = (userId: string) => {
    return useQuery({
      queryKey: ["recentlyViewed", userId], 
      queryFn: () => getViewedToday(userId),
      enabled: !!userId,
    });
  };
  export const useGetViewedYesterday= (userId: string) => {
    return useQuery({
      queryKey: ["recentlyViewed", userId], 
      queryFn: () => getViewedYesterday(userId),
      enabled: !!userId,
    });
  };
  export const useGetRecentlyViewed= (userId: string) => {
    return useQuery({
      queryKey: ["recentlyViewed", userId], 
      queryFn: () => getRecentlyViewed(userId),
      enabled: !!userId,
    });
  };

  export const useGetTopProducts= () => {
    return useQuery({
      queryKey: ['topProducts'],
      queryFn: ({pageParam}) =>  getTopProducts(),
    });
};
  export const useGetNewProducts= () => {
    return useInfiniteQuery<fetchNewProductsReturnType, Error>({
      queryKey: ['newProducts'],
      queryFn: ({pageParam}) =>  getNewProducts({pageParam}),
      initialPageParam: null, 
      getNextPageParam: (lastPage: fetchNewProductsReturnType) => {
      if (!lastPage.lastVisible || lastPage.products.length < 4) {
        return undefined;
      }
      return lastPage.lastVisible;
    },
    });
};

  export const useGetPopularProducts= () => {
    return useInfiniteQuery<fetchNewProductsReturnType, Error>({
      queryKey: ['popularProducts'],
      queryFn: ({pageParam}) =>  getPopularProducts({pageParam}),
      initialPageParam: null, 
      getNextPageParam: (lastPage: fetchNewProductsReturnType) => {
      if (!lastPage.lastVisible || lastPage.products.length < 4) {
        return undefined;
      }
      return lastPage.lastVisible;
    },
    });
};

  export const useGetPersonalizedProducts= () => {
    return useInfiniteQuery<fetchNewProductsReturnType, Error>({
      queryKey: ['personalizedProducts'],
      queryFn: ({pageParam}) =>  getPersonalizedProducts({pageParam}),
      initialPageParam: null, 
      getNextPageParam: (lastPage: fetchNewProductsReturnType) => {
      if (!lastPage.lastVisible || lastPage.products.length < 4) {
        return undefined;
      }
      return lastPage.lastVisible;
    },
    });
};