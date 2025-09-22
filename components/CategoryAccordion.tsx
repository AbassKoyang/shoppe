import { ChevronDown, ChevronUp } from "lucide-react"

const CategoryAccordion = () => {
  return (
    <div className="w-full mt-3">
        <div className="w-full flex items-center justify-between p-1 rounded-[7px] shadow-[0_5px_10px_0_rgba(0,0,0,0.12)]">
            <div className="flex items-center gap-2">
                <img src="/assets/images/clothing-1.png" alt="Clothing Image" className="size-[44px] rounded-[5px]" />
                <p className="font-raleway font-bold text-black text-[17px]">Clothing</p>
            </div>
            <button className="flex items justify-center">
                <ChevronDown className="size-[25px] text-dark-blue" />
            </button>
        </div>
        <div className="w-full mt-3 grid grid-cols-2 grid-rows-5 gap-1.5">
            <button className="font-raleway font-bold text-[15px] rounded-[7px] border-3 border-[#FFEBEB] cols-span-1 row-span-1 py-2">Skirts</button>
            <button className="font-raleway font-bold text-[15px] rounded-[7px] border-3 border-[#FFEBEB] cols-span-1 row-span-1 py-2">Skirts</button>
            <button className="font-raleway font-bold text-[15px] rounded-[7px] border-3 border-[#FFEBEB] cols-span-1 row-span-1 py-2">Skirts</button>
            <button className="font-raleway font-bold text-[15px] rounded-[7px] border-3 border-[#FFEBEB] cols-span-1 row-span-1 py-2">Skirts</button>
            <button className="font-raleway font-bold text-[15px] rounded-[7px] border-3 border-[#FFEBEB] cols-span-1 row-span-1 py-2">Skirts</button>
            <button className="font-raleway font-bold text-[15px] rounded-[7px] border-3 border-[#FFEBEB] cols-span-1 row-span-1 py-2">Skirts</button>
            <button className="font-raleway font-bold text-[15px] rounded-[7px] border-3 border-[#FFEBEB] cols-span-1 row-span-1 py-2">Skirts</button>
            <button className="font-raleway font-bold text-[15px] rounded-[7px] border-3 border-[#FFEBEB] cols-span-1 row-span-1 py-2">Skirts</button>
            <button className="font-raleway font-bold text-[15px] rounded-[7px] border-3 border-[#FFEBEB] cols-span-1 row-span-1 py-2">Skirts</button>
            <button className="font-raleway font-bold text-[15px] rounded-[7px] border-3 border-[#FFEBEB] cols-span-1 row-span-1 py-2">Skirts</button>
        </div>
    </div>
  )
}

export default CategoryAccordion