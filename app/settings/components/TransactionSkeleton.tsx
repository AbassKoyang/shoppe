import React from 'react'

const TransactionSkeleton = () => {
  return (
    <div className='w-full px-5 py-4 rounded-[14px] bg-gray-200 flex items-center justify-between mb-1'>
    <div className="flex gap-4 items-center">
        <div className="size-[40px] rounded-full skeleton"></div>
        <div className="">
            <div className="w-[100px] h-3 rounded-[6px] skeleton"></div>
            <div className="w-[100px] h-5 rounded-[6px] skeleton mt-1"></div>
        </div>
    </div>

    <div className="">
        <div className="w-[60px] h-6 rounded-[6px] skeleton"></div>
    </div>
</div>
  )
}

export default TransactionSkeleton