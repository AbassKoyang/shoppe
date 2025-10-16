import React from 'react'

const InboxSkeleton = () => {
  return (
    <div className='w-full bg-white py-3 border-b border-gray-200'>
        <div className="w-full flex items-center justify-between">
            <div className="size-[60px] rounded-full skeleton"></div>
            <div className="w-[80%]">
                <div className="w-full flex justify-between items-start">
                    <div className="h-8 w-[200px] rounded-[6px] skeleton"></div>
                    <div className="h-2 w-10 rounded-[6px] skeleton">
                    </div>
                </div>

                <div className="h-4 w-[200px] rounded-[6px] skeleton mt-2"></div>
            </div>
        </div>
    </div>
  )
}

export default InboxSkeleton