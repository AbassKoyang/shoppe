import { SUB_CATEGORIES } from "@/lib/utils/index"
import { CategoryType } from "@/services/products/types"
import { ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link";
import { useState } from "react";

const CategoryAccordion = ({category} : {category: CategoryType}) => {
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  return (
    <div className="w-full mt-2">
        <div className="w-full flex items-center justify-between p-1 rounded-[7px] shadow-[0_5px_10px_0_rgba(0,0,0,0.12)]">
            <div className="flex items-center gap-2">
                <img src="/assets/images/clothing-1.png" alt="Clothing Image" className="size-[44px] rounded-[5px]" />
                <p className="font-raleway font-bold text-black text-[17px]">{category}</p>
            </div>
            <button onClick={() => setIsAccordionOpen(!isAccordionOpen)} className="flex items justify-center">
                <ChevronDown className={`size-[25px] ${isAccordionOpen ? 'text-dark-blue rotate-180' : 'text-black rotate-0'} transition-all duration-300 ease-in-out`} />
            </button>
        </div>
        <div className={`w-full mt-3 grid grid-cols-2 grid-rows-5 gap-1.5 ${isAccordionOpen ? 'h-[350px]' : 'h-0'} transition-all duration-300 ease-in-out overflow-hidden`}>
            {SUB_CATEGORIES[`${category}`].map((subcat) => (
                <Link href={`/sub-categories/${subcat}`} className="font-raleway font-bold text-[15px] rounded-[7px] border-3 border-[#FFEBEB] cols-span-1 row-span-1 py-2">{subcat}</Link>
            ))}
        </div>
    </div>
  )
}

export default CategoryAccordion