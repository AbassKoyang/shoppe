'use client';
import AllCategoriesFilterModal from "@/components/AllCategoriesFilter";
import FilterModal from "@/components/FilterModal";
import JustForYouProductCard from "@/components/JustForYouProductCard";
import { SUB_CATEGORIES } from "@/lib/utils";
import { useFetchProductByCategory, useFetchProductCategoryCount } from "@/services/products/queries";
import { CategoryType } from "@/services/products/types";
import { ArrowLeft, ChevronLeft, Link, Settings2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

const Page = () => {
    const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const param = useParams<{category: string}>();
    const category = param.category as CategoryType;
    const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1) as CategoryType;
    const subCategories  = SUB_CATEGORIES[`${formattedCategory}`];
    const {isLoading, isError, data: products} = useFetchProductByCategory(formattedCategory);

  return (
        <section className='w-full mt-6 relative overflow-x-hidden'>
            <AllCategoriesFilterModal open={isCategoriesModalOpen} closeModal={() => setIsCategoriesModalOpen(false)} />
            <FilterModal open={isFilterModalOpen} closeModal={() => setIsFilterModalOpen(false)} />
            <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button className="flex items-center justify-center">
                        <ArrowLeft className="size-[30px]" />
                    </button>
                    <h2 className='font-semibold font-raleway text-[30px]'>{formattedCategory}</h2>
                </div>
                <button onClick={() => setIsCategoriesModalOpen(true)} className="px-3 py-1 rounded-3xl bg-dark-blue flex items-center justify-center gap-1 cursor-pointer">
                    <p className="text-white text-sm">Filter</p>
                    <Settings2 strokeWidth={2} className="size-[16px] text-white" />
                </button>
            </div>
            <div className="w-full mt-4">
            <div className="w-full flex items-center justify-between">
                {subCategories.slice(0, 5).map((subcat) => (
                        <div className="flex flex-col items-center">
                            <div className="size-[60px] border-5 border-white shadow-[0_5px_10px_0_rgba(0,0,0,0.12)] rounded-full object-contain object-center overflow-hidden">
                            <img src="/assets/images/bags-1.png" alt="Clothing image" className="size-full"/>
                            </div>
                            <p className="text-xs font-raleway font-medium text-center mt-2">{subcat}</p>
                        </div>
                ))}
            </div>
        <div className="w-full flex items-center justify-between mt-3">
            {subCategories.slice(5).map((subcat) => (
                    <div className="flex flex-col items-center">
                        <div className="size-[60px] border-5 border-white shadow-[0_5px_10px_0_rgba(0,0,0,0.12)] rounded-full object-contain object-center overflow-hidden">
                        <img src="/assets/images/bags-1.png" alt="Clothing image" className="size-full"/>
                        </div>
                        <p className="text-xs font-raleway font-medium text-center mt-2">{subcat}</p>
                    </div>
            ))}
        </div>
        </div>

        <section className="w-full mt-6">
            <div className="w-full flex items-center justify-between">
                    <h3 className="text-[22px] font-raleway font-semibold text-[#202020]">All Items</h3>
                    <button onClick={() => setIsFilterModalOpen(true)} className="px-3 py-1 rounded-3xl bg-dark-blue flex items-center justify-center gap-1 cursor-pointer">
                    <p className="text-white text-sm">Filter</p>
                    <Settings2 strokeWidth={2} className="size-[16px] text-white" />
                    </button>
            </div>
            <div className="w-full h-fit grid grid-cols-2 gap-1.5 mt-3">
            {isLoading && (
                <div className='size-full bg-gray-200 animate-pulse rounded-[9px] grid grid-cols-2 grid-rows-2 gap-1.5 p-1.5 shadow-[0_5px_10px_0_rgba(0,0,0,0.12)]'>
                    <div className="col-span-1 row-span-1 rounded-[5px] bg-gray-300 animate-pulse"></div>
                    <div className="col-span-1 row-span-1 rounded-[5px] bg-gray-300 animate-pulse"></div>
                    <div className="col-span-1 row-span-1 rounded-[5px] bg-gray-300 animate-pulse"></div>
                    <div className="col-span-1 row-span-1 rounded-[5px] bg-gray-300 animate-pulse"></div>
                </div>
            )}

            {isError && (
                <div className='w-full h-full flex items-center justify-center'>
                    <p>Failed to load category.</p>
                </div>
            )}
            {products && products.map((product) => (
                <JustForYouProductCard />
            ))}
            </div>
        </section>
     </section>
)
}

 export default Page;