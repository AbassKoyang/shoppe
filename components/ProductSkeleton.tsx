import React from 'react'

const ProductSkeleton = () => {
  return (
    <div className='min-w-[140px] w-[48%] p-1.5 shadow-[0_5px_10px_0_rgba(0,0,0,0.12)] mt-2.5 bg-gray-200 rounded-[9px]'>
      <div className="w-full h-[145px] p-1.5 rounded-[6px] skeleton"></div>
      <div className="w-full h-5 rounded-[6px] skeleton mt-1"></div>
      <div className="w-[90%] h-5 rounded-[6px] skeleton mt-1"></div>
      <div className="w-[60%] h-3 row-span-1 rounded-[6px] skeleton mt-2"></div>
    </div>
  )
}

export default ProductSkeleton