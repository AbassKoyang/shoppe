'use client';
import { CATEGORIES } from '@/lib/utils';
import { addRecentSearch } from '@/lib/utils/recentSearches';
import { useRouter } from 'next/navigation';

const Recommendations = () => {
    const router = useRouter()
    const handleButtonClick = (query: string) => {
          if(query !== ''){
              router.push(`/search/search-results/${query}`)
              addRecentSearch(query);
          }
      }
  return ( 
        <div className="w-full mt-5">
            <h4 className='font-raleway font-medium text-[18px] text-[#202020]'>Recommendations</h4>
        <div className="w-full flex items-center flex-wrap gap-2 mt-3">
            {CATEGORIES.map((cat) => (
                <button onClick={() => handleButtonClick(cat.label)} key={cat.value} className='cursor-pointer rounded-[9px] bg-[#F4F4F4] px-3 py-2 text-[17px] font-raleway font-medium text-[#202020]'>
                    {cat.label}
                </button>
            ))}
        </div>
    </div>
  )
}

export default Recommendations