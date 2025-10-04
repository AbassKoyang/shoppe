'use client';
import { Search } from 'lucide-react'
import Link from 'next/link'
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import RecentSearches from './RecentSearches';
import { addRecentSearch } from '@/lib/utils/recentSearches';
import Recommendations from './Recommendations';
import { useParams, useRouter } from 'next/navigation';

const SearchResultHeader = () => {
  const queryParam = decodeURIComponent(useParams<{query: string}>().query);
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
    const handleFormSubmit = (e: FormEvent) => {
      e.preventDefault();
        if(query !== ''){
            router.push(`/search/search-results/${encodeURIComponent(query)}`)
            addRecentSearch(query);
        }
    }
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

  return (
    <div ref={containerRef}>
    <header className="w-full flex items-center justify-between py-4">
        <h3 className="font-bold font-raleway text-[30px] text-[#202020]">Search</h3>
       <div className="flex items-center gap-2">
          <form onSubmit={handleFormSubmit} className="focus-within:border-1 focus-within:border-dark-blue w-[210px] [@media(min-width:400px)]:w-[220px] h-[36px] rounded-2xl bg-[#F8F8F8] flex items-center justify-between overflow-hidden">
            <input 
              onFocus={() => setIsOpen(true)}
              onChange={(e) => setQuery(e.target.value)} defaultValue={queryParam} type="text" placeholder="Search" className="h-full w-[80%] pl-4 bg-transparent placeholder:text-[#C7C7C7] outline-0 stroke-0 border-0" />
              <button type='submit' className="flex items-center justify-center mr-2 cursor-pointer">
                <Search strokeWidth={1} className="size-[19px] text-dark-blue" />
              </button>
          </form>
       </div>
    </header>
    {
        isOpen && query == '' && (
        <div className="w-full">
            <RecentSearches />
            <Recommendations />
         </div>
        )
    }
    </div>
  )
}

export default SearchResultHeader;