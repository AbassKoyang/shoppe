import React from 'react'

const OrderCardSkeleton = () => {
  return (
    <div className="w-full h-[110px] bg-gray-200 p-2 rounded-[9px] flex items-start justify-between gap-3 mb-2">
        <div className="h-full w-[130px] rounded-[6px] skeleton"></div>
        <div className="w-full max-w-[calc(100%-130px)] h-full flex flex-col justify-between">
            <div className="h-6 w-[80px] skeleton rounded-[6px]">
            </div>
           <div className="w-full">
                <div className="h-6 w-[150px] skeleton rounded-[6px] mt-0.5">
                </div>
                <div className="h-4 w-[170px] skeleton rounded-[6px] mt-0.5">
                </div>
                <div className="w-full flex justify-between items-center mt-0.5">
                    <div className="h-3 w-[80px] rounded-2xl skeleton"></div>
                    <div className="h-3 w-[100px] rounded-[6px] skeleton"></div>
                </div>
           </div>
        </div>
    </div>
)
}

export default OrderCardSkeleton