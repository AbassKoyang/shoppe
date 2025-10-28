'use client';
import AllCategoriesFilterModal from "@/components/AllCategoriesFilter";
import FilterModal from "@/components/FilterModal";
import JustForYouProductCard from "@/components/JustForYouProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";
import SubCategoriesFilterModal from "@/components/SubCategoriesFilterModal";
import SubCategoryAvatar from "@/components/SubCategoryAvatar";
import { SUB_CATEGORIES } from "@/lib/utils/index";
import { useFetchProductByCategory, useFetchProductBySubCategory, useFetchProductCategoryCount } from "@/services/products/queries";
import { CategoryType } from "@/services/products/types";
import { ArrowLeft, ChevronLeft, Settings2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
    const router = useRouter();
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const subCategory = decodeURIComponent(useParams<{subCategory: string}>().subCategory);
    const {isLoading, isError, isFetching, data: products} = useFetchProductBySubCategory(subCategory);

  return (
        <section className='w-full mt-6 relative overflow-x-hidden'>
            <SubCategoriesFilterModal open={isFilterModalOpen} closeModal={() => setIsFilterModalOpen(false)} />
            <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="flex items-center justify-center">
                        <ArrowLeft className="size-[30px]" />
                    </button>
                    <h2 className='font-semibold font-raleway text-[30px]'>{subCategory}</h2>
                </div>
            </div>

        <section className="w-full mt-6">
            <div className="w-full flex items-center justify-between">
                    <h3 className="text-[22px] font-raleway font-semibold text-[#202020]">All Items ({products.length})</h3>
                    <button onClick={() => setIsFilterModalOpen(true)}  className="px-3 py-1 rounded-3xl bg-dark-blue flex items-center justify-center gap-1 cursor-pointer">
                        <p className="text-white text-sm">Filter</p>
                        <Settings2 strokeWidth={2} className="size-[16px] text-white" />
                    </button>
            </div>
            {products && products.length > 0 && (
                <div className="w-full h-fit grid grid-cols-2 gap-1.5 mt-3 mb-[500px]">
                        {products.map((product: any) => (
                        <JustForYouProductCard key={product} product={product} />
                        ))}          
                </div>
            ) }
            {isLoading && (
                <div className="w-full flex justify-between flex-wrap mt-3">
                <ProductSkeleton />
                <ProductSkeleton />
                <ProductSkeleton />
                <ProductSkeleton />
                <ProductSkeleton />
                <ProductSkeleton />
                </div>
            )}
            {isFetching && (
                <div className="w-full flex justify-between flex-wrap mt-3">
                <ProductSkeleton />
                <ProductSkeleton />
                <ProductSkeleton />
                <ProductSkeleton />
                <ProductSkeleton />
                <ProductSkeleton />
                </div>
            )}

            {products && products.length === 0 && (
            <div className='w-full h-[50dvh] flex items-center justify-center'>
                <p>Oops, no results for this search.</p>
            </div>
            )}

            {isError && (
                <div className='w-full h-[50dvh] flex items-center justify-center'>
                    <p>Failed to load sub category.</p>
                </div>
            )}
        </section>
     </section>
)
}

 export default Page;