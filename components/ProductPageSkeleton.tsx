import React from 'react'

const ProductPageSkeleton = () => {
  return (
    <div className='w-full bg-gray-200'>
        <div className="w-full h-[439px] rounded-b-[18px] skeleton"></div>
        <div className="w-full px-4 mt-3">
            <div className="w-[40%] h-10 rounded-[6px] skeleton mt-2"></div>
            <div className="w-[70%] h-8 rounded-[6px] skeleton mt-2"></div>
            <div className="w-[80%] h-5 rounded-[6px] skeleton mt-5"></div>
            <div className="w-[50%] h-8 rounded-[6px] skeleton mt-5"></div>
        </div>
        <div className="w-full flex flex-wrap justify-between items-start px-4">
        <div className="w-[50%] flex flex-col items-start">
            <div className="w-[50%] h-8 rounded-[6px] skeleton mt-5"></div>
            <div className="w-[40%] h-5 rounded-[6px] skeleton mt-5"></div>
        </div>
        <div className="w-[50%] flex flex-col items-start">
            <div className="w-[50%] h-8 rounded-[6px] skeleton mt-5"></div>
            <div className="w-[40%] h-5 rounded-[6px] skeleton mt-5"></div>
        </div>
        <div className="w-[50%] flex flex-col items-start">
            <div className="w-[50%] h-8 rounded-[6px] skeleton mt-5"></div>
            <div className="w-[40%] h-5 rounded-[6px] skeleton mt-5"></div>
        </div>
        <div className="w-[50%] flex flex-col items-start">
            <div className="w-[50%] h-8 rounded-[6px] skeleton mt-5"></div>
            <div className="w-[40%] h-5 rounded-[6px] skeleton mt-5"></div>
        </div>
        <div className="w-[50%] flex flex-col items-start">
            <div className="w-[50%] h-8 rounded-[6px] skeleton mt-5"></div>
            <div className="w-[40%] h-5 rounded-[9px] skeleton mt-5"></div>
        </div>
        <div className="w-[50%] flex flex-col items-start">
            <div className="w-[50%] h-8 rounded-[9px] skeleton mt-5"></div>
            <div className="w-[40%] h-5 rounded-[9px] skeleton mt-5"></div>
        </div>
        <div className="w-[50%] flex flex-col items-start">
            <div className="w-[50%] h-8 rounded-[6px] skeleton mt-5"></div>
            <div className="w-[40%] h-5 rounded-[6px] skeleton mt-5"></div>
        </div>
        <div className="w-[50%] flex flex-col items-start">
            <div className="w-[50%] h-8 rounded-[6px] skeleton mt-5"></div>
            <div className="w-[40%] h-5 rounded-[6px] skeleton mt-5"></div>
        </div>
        </div>
        <div className="w-[97%] fixed bottom-3 left-[50%] translate-x-[-50%] px-3 [@media(min-width:375px)]:px-3 py-3 bg-gray-200 flex items-center justify-between rounded-[40px] shadow-[0_5px_10px_0_rgba(0,0,0,0.12)]">
            <div className="size-[47px] rounded-full skeleton"></div>
            <div className="w-[200px] h-[47px] rounded-[40px] skeleton"></div>
            <div className="w-[100px] h-[47px] rounded-[40px] skeleton"></div>
        </div>
    </div>
  )
}

export default ProductPageSkeleton