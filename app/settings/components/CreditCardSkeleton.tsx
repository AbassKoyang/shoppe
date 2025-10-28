import React from 'react'

const CreditCardSkeleton = () => {
  return (
    <div className='w-[88%] h-[155px] rounded-xl bg-gray-200 p-3'>
        <div className="w-full flex justify-between items-center mt-3">
            <div className='w-[100px] h-8 rounded-[6px] skeleton'></div>
            <div className="size-[30px] rounded-full skeleton"></div>
        </div>
        <div className='w-full h-6 rounded-[6px] skeleton mt-5'></div>
        <div className="flex w-full items-center justify-between mt-3">
            <div className="w-[100px] h-4 rounded-[6px] skeleton"></div>
            <div className='w-[80px] h-4 rounded-[6px] skeleton'></div>
        </div>
    </div>
  )
}

export default CreditCardSkeleton