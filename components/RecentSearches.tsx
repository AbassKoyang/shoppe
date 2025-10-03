'use client';
import { addRecentSearch, clearRecentSearches, getRecentSearches } from '@/lib/utils/recentSearches'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React from 'react'

const RecentSearches = () => {
    const router = useRouter();
    const recentSearches = getRecentSearches();
    const handleButtonClick = (query: string) => {
        if(query !== ''){
            router.push(`/search/search-results/${query}`)
            addRecentSearch(query);
        }
    }
  return ( 
    recentSearches ? (
        <div className="w-full mt-3">
        <div className="flex w-full items-center justify-between">
            <h4 className='font-raleway font-medium text-[18px] text-[#202020]'>Search History</h4>
            <button onClick={() => clearRecentSearches()} className='flex items-center justify-center size-[35px] bg-[#F9F9F9] rounded-full cursor-pointer'>
                <Trash2 className='text-[#D97474] size-[18px]' />
            </button>
        </div>
        <div className="w-full flex items-center flex-wrap gap-2 mt-3">
            {recentSearches.map((r) => (
                <button onClick={() => handleButtonClick(r)} key={r} className='cursor-pointer rounded-[9px] bg-[#F4F4F4] px-3 py-2 text-[17px] font-raleway font-medium text-[#202020]'>
                    {r}
                </button>
            ))}
        </div>
    </div>
    ) : null
  )
}

export default RecentSearches