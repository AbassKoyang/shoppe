'use client';
import { addRecentSearch } from "@/lib/utils/recentSearches";
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const HomeHeader = () => {
  const [query, setQuery] = useState('');
  const router = useRouter();
    const handleFormSubmit = (e: FormEvent) => {
      e.preventDefault();
        if(query !== ''){
            router.push(`/search/search-results/${query}`)
            addRecentSearch(query);
        }
    }
  return (
    <header className="w-full flex items-center justify-between py-4">
        <h3 className="font-bold font-raleway text-[30px] text-[#202020]">Shop</h3>
       <div className="flex items-center gap-2">
       <form onSubmit={handleFormSubmit} className="focus-within:border-1 focus-within:border-dark-blue w-[210px] [@media(min-width:400px)]:w-[220px] h-[36px] rounded-2xl bg-[#F8F8F8] flex items-center justify-between overflow-hidden">
            <input 
              onChange={(e) => setQuery(e.target.value)} type="text" placeholder="Search" className="h-full w-[80%] pl-4 bg-transparent placeholder:text-[#C7C7C7] outline-0 stroke-0 border-0" />
              <button type='submit' className="flex items-center justify-center mr-2 cursor-pointer">
                <Search strokeWidth={1} className="size-[19px] text-dark-blue" />
              </button>
          </form>
          <Link href='/add-product' className="size-[30px] rounded-full bg-dark-blue flex items-center justify-center">
           <Plus className="text-white size-[16px]" />
          </Link>
       </div>
    </header>
  )
}

export default HomeHeader