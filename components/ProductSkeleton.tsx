import React from 'react'

const ProductSkeleton = () => {
  return (
    <div className='col-span-1 row-span-1 bg-gray-300 animate-pulse rounded-[9px] p-1.5 shadow-[0_5px_10px_0_rgba(0,0,0,0.12)]'>
    <div className="w-full h-[171px] p-1.5 rounded-[9px] bg-gray-200 animate-pulse"></div>
    <div className="w-full h-5 rounded-[5px] bg-gray-200 animate-pulse mt-2"></div>
    <div className="w-[90%] h-5 rounded-[5px] bg-gray-200 animate-pulse mt-2"></div>
    <div className="w-[60%] h-3 row-span-1 rounded-[5px] bg-gray-200 animate-pulse mt-5"></div>
    </div>
  )
}

export default ProductSkeleton