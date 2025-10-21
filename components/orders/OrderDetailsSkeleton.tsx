import React from 'react'

const OrderDetailsSkeleton = () => {
  return (
    <div className="w-full rounded-xl bg-gray-200 shadow-[0_5px_10px_0_rgba(0,0,0,0.12)] overflow-hidden mb-5">
        <div className="w-full px-3 py-2 flex items-center justify-between">
            <div className=""></div>
            <div className="flex flex-col items-end">
                <div className="w-[150px] h-5 skeleton rounded-[6px]"></div>
                <div className="w-[100px] h-3 skeleton rounded-[6px] mt-1"></div>
            </div>
        </div>
        <div className="w-full h-[400px] overflow-hidden skeleton">
        </div>
        <div className="w-full px-4 mt-3">
            <div className="w-[40%] h-10 rounded-[6px] skeleton mt-2"></div>
            <div className="w-[70%] h-8 rounded-[6px] skeleton mt-2"></div>
            <div className="w-[80%] h-5 rounded-[6px] skeleton mt-5"></div>
            <div className="w-[50%] h-8 rounded-[6px] skeleton mt-5"></div>
        </div>
        <div className="w-full px-3 py-5 border-b border-b-gray-200 flex justify-between items-start">
            <div className="">
                <div className="w-[80px] h-3 rounded-[6px] skeleton"></div>
                <div className="w-[120px] h-5 rounded-[6px] skeleton"></div>
            </div>
            <div className="">
                <div className="w-[80px] h-3 rounded-[6px] skeleton"></div>
                <div className="w-[120px] h-5 rounded-[6px] skeleton"></div>
            </div>
            <div className="">
                <div className="w-[80px] h-3 rounded-[6px] skeleton"></div>
                <div className="w-[120px] h-5 rounded-[6px] skeleton"></div>
            </div>
            
        </div>
        <div className="w-full px-3 py-5">
            <div className="w-[100px] h-3 skeleton rounded-[6px]"></div>
         <div className="w-full flex items-center justify-between">
            <div className="flex flex-col items-start justify-start">
                <div className="w-[150px] h-5 skeleton rounded-[6px]"></div>
                <div className="w-[160px] h-5 skeleton rounded-[6px] mt-1"></div>
            </div>
            <div className="size-[70px] rounded-xl overflow-hidden skeleton">
                
            </div>
         </div>
        </div>
        <div className="px-3">
         <div className="w-full h-10 rounded-[6px] skeleton mb-3">
        </div>
        </div>
    </div>
  )
}

export default OrderDetailsSkeleton