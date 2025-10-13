import React from 'react'

const ChatSkeleton = () => {
  return (
    <div className='w-full bg-white h-dvh'>
        <div className="fixed top-0 left-0 w-full h-[100px] px-2 [@media(min-width:375px)]:px-4 flex items-center justify-between bg-gray-200">
            <div className="w-full flex gap-3 items-center">
                <div className="size-[44px] rounded-full skeleton"></div>
                <div className="h-10 w-[200px] rounded-[6px] skeleton"></div>
            </div>
            <div className="h-8 w-2 rounded-[6px] skeleton">
            </div>
        </div>
        <div className="w-full h-[100vh] flex flex-col justify-center bg-gray-200 px-2 [@media(min-width:375px)]:px-4">
                 <div className={`w-[200px] h-10 rounded-4xl ml-auto skeleton mt-3`}></div>
                <div className={`w-[200px] h-10 rounded-4xl mr-auto skeleton mt-3`}></div>
                <div className={`w-[200px] h-10 rounded-4xl ml-auto skeleton mt-3`}></div>
                <div className={`w-[200px] h-10 rounded-4xl mr-auto skeleton mt-3`}></div>
                <div className={`w-[200px] h-10 rounded-4xl ml-auto skeleton mt-3`}></div>
                <div className={`w-[200px] h-10 rounded-4xl mr-auto skeleton mt-3`}></div>
        </div>
        <div className="fixed bottom-0 left-0 w-full rounded-4xl px-4 py-2 flex justify-between items-center bg-gray-200">
            <div className="w-[85%] h-[50px] rounded-4xl skeleton"></div>
            <div className="w-[10%] h-[50px] rounded-[6px] skeleton"></div>
        </div>
    </div>
  )
}

export default ChatSkeleton