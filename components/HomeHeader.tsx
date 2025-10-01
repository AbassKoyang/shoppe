import { Plus, Search } from "lucide-react"
import Link from "next/link"

const HomeHeader = () => {
  return (
    <header className="w-full flex items-center justify-between py-4">
        <h3 className="font-bold font-raleway text-[30px] text-[#202020]">Shop</h3>
       <div className="flex items-center gap-2">
          <div className="focus-within:border-1 focus-within:border-dark-blue w-[210px] [@media(min-width:400px)]:w-[220px] h-[36px] rounded-2xl bg-[#F8F8F8] flex items-center justify-between overflow-hidden">
            <input type="text" placeholder="Search" className="h-full w-[80%] pl-4 bg-transparent placeholder:text-[#C7C7C7] outline-0 stroke-0 border-0" />
            <button className="flex items-center justify-center mr-2">
              <Search strokeWidth={1} className="size-[19px] text-dark-blue" />
            </button>
          </div>
          <Link href='/add-product' className="size-[30px] rounded-full bg-dark-blue flex items-center justify-center">
           <Plus className="text-white size-[16px]" />
          </Link>
       </div>
    </header>
  )
}

export default HomeHeader