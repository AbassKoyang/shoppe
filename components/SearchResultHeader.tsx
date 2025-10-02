'use client';
import { Search } from 'lucide-react'
import Link from 'next/link'
import React, { useRef, useState } from 'react'
import RecentSearches from './RecentSearches';
import { addRecentSearch } from '@/lib/utils/recentSearches';
import Recommendations from './Recommendations';
import { useRouter } from 'next/navigation';

const SearchResultHeader = () => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const router = useRouter();
    const handleSearchButtonClick = () => {
        if(query !== ''){
            router.push(`/search-results/${query}`)
            addRecentSearch(query);
        }
    }

  return (
    <>
    <header className="w-full flex items-center justify-between py-4">
        <h3 className="font-bold font-raleway text-[30px] text-[#202020]">Search</h3>
       <div className="flex items-center gap-2">
          <div className="focus-within:border-1 focus-within:border-dark-blue w-[210px] [@media(min-width:400px)]:w-[220px] h-[36px] rounded-2xl bg-[#F8F8F8] flex items-center justify-between overflow-hidden">
            <input 
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => setQuery(e.target.value)} type="text" placeholder="Search" className="h-full w-[80%] pl-4 bg-transparent placeholder:text-[#C7C7C7] outline-0 stroke-0 border-0" />
            <button onClick={handleSearchButtonClick} className="flex items-center justify-center mr-2 cursor-pointer">
              <Search strokeWidth={1} className="size-[19px] text-dark-blue" />
            </button>
          </div>
       </div>
    </header>
    {
        query == '' && (
        <div className="w-full">
            <RecentSearches />
            <Recommendations />
         </div>
        )
    }
    </>
  )
}

export default SearchResultHeader;