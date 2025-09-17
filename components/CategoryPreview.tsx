import Link from 'next/link'
import React from 'react'

const CategoryPreview = () => {
  return (
        <button className='col-span-1 row-span-1 rounded-lg p-1.5 shadow-sm'>
            <div className="w-full h-[83%] grid grid-cols-2 grid-rows-2 gap-1">
                <div className="col-span-1 row-span-1 gap-1 rounded-lg object-center object-contain overflow-hidden">
                    <img className='size-full' src="/assets/images/clothing-1.png" alt="clothing picture" />
                </div>
                <div className="col-span-1 row-span-1 gap-1 rounded-lg object-center object-contain overflow-hidden">
                    <img className='size-full' src="/assets/images/clothing-1.png" alt="clothing picture" />
                </div>
                <div className="col-span-1 row-span-1 gap-1 rounded-lg object-center object-contain overflow-hidden">
                    <img className='size-full' src="/assets/images/clothing-1.png" alt="clothing picture" />
                </div>
                <div className="col-span-1 row-span-1 gap-1 rounded-lg object-center object-contain overflow-hidden">
                    <img className='size-full' src="/assets/images/clothing-1.png" alt="clothing picture" />
                </div>
            </div>

            <div className="w-full h-[17%] flex items-end justify-between">
                <h5 className='text-black text-[19px] font-bold font-raleway'>Dresses</h5>
                <span className='px-3 py-1 rounded-md bg-[#DFE9FF] text-xs font-bold'>109</span>
            </div>
        </button>
  )
}

export default CategoryPreview;