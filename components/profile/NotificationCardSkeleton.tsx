import React from 'react'

const NotificationCardSkeleton = () => {
  return (
    <div className="w-full flex items-start justify-between bg-gray-200 rounded-xl mb-2 py-2 px-3">
        <div className="size-[40px] rounded-full overflow-hidden skeleton"></div>
        <div className="flex flex-col">
            <div className="w-[200px] h-6 rounded-[6px] skeleton"></div>
            <div className="w-[250px] h-3 rounded-[6px] skeleton mt-1"></div>
        </div>
    </div>
  )
}

export default NotificationCardSkeleton