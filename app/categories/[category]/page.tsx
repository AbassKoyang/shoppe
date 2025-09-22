'use client';
import { SUB_CATEGORIES } from "@/app/add-product/page";
import AllCategoriesFilterModal from "@/components/AllCategoriesFilter";
import JustForYouProductCard from "@/components/JustForYouProductCard";
import { CategoryType } from "@/services/products/types";
import { ArrowLeft, ChevronLeft, Link, Settings2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { FaChevronLeft } from "react-icons/fa6";

const Page = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const param = useParams<{category: string}>();
    const category = param.category as CategoryType;
    const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1) as CategoryType;
    const subCategories  = SUB_CATEGORIES[`${formattedCategory}`];
  return (
    <section className='w-full mt-6 relative overflow-x-hidden'>
        <AllCategoriesFilterModal open={isModalOpen} closeModal={() => setIsModalOpen(false)} />
        <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
                <button className="flex items-center justify-center">
                    <ArrowLeft className="size-[30px]" />
                </button>
                <h2 className='font-semibold font-raleway text-[30px]'>{formattedCategory}</h2>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center">
                <Settings2 strokeWidth={2} className="size-[24px] rotate-90" />
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
                    <h3 className="text-[22px] font-raleway font-semibold text-[#202020]">Categories</h3>
                <Settings2 strokeWidth={2} className="size-[24px] rotate-90" />
            </div>
            <div className="w-full h-fit grid grid-cols-2 gap-1.5 mt-3">
                <JustForYouProductCard />
                <JustForYouProductCard />
                <JustForYouProductCard />
                <JustForYouProductCard />
                <JustForYouProductCard />
                <JustForYouProductCard />
            </div>
        </section>
    </section>
  )
}

 export default Page;