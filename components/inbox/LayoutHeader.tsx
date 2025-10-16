'use client';
import { EllipsisVertical, Search } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'

const LayoutHeader = () => {
    const pathname = usePathname();
  return (
    <header className="w-full py-4 relative">
        <div className="w-full sticky top-2 left-0">
            <div className="w-full flex items-center justify-between">
                <h1 className='font-raleway font-bold text-[28px] tracking-[-0.28px]'>Inbox</h1>
                <button>
                        <EllipsisVertical className='size-[20px]' />
                </button>
            </div>
            <div className="my-4">
            <form className="focus-within:border-1 focus-within:border-dark-blue w-full h-[36px] rounded-2xl bg-[#F8F8F8] flex items-center justify-between overflow-hidden">
                <input 
                type="text" placeholder="Search" className="h-full w-[80%] pl-4 bg-transparent placeholder:text-[#C7C7C7] outline-0 stroke-0 border-0" />
                <button type='submit' className="flex items-center justify-center mr-2 cursor-pointer">
                    <Search strokeWidth={1} className="size-[19px] text-dark-blue" />
                </button>
            </form>
            </div>
        </div>

       <div className="w-full flex items-center justify-between">
        <Link href='/inbox' className={`${pathname == '/inbox' ? 'text-white' : 'text-[#202020]'} relative w-[30%] bg-[#F8F8F8] font-raleway text-[16px] font-semibold py-1.5 rounded-[40px] flex items-center justify-center overflow-hidden`}>
            <div className={`bg-dark-blue absolute top-0 left-0 z-10 transition-all duration-300 ease-in-out h-full ${pathname == '/inbox' ? 'w-full' : 'w-0'}`}></div>
            <p className='z-20'>All</p>
        </Link>
        <Link href='/inbox/selling' className={`${pathname == '/inbox/selling' ? 'text-white' : 'text-[#202020]'} relative w-[30%] bg-[#F8F8F8] font-raleway text-[16px] font-semibold py-1.5 rounded-[40px] flex items-center justify-center overflow-hidden`}>
            <div className={`bg-dark-blue absolute top-0 left-0 z-10 transition-all duration-300 ease-in-out h-full ${pathname == '/inbox/selling' ? 'w-full' : 'w-0'}`}></div>
            <p className='z-20'>Selling</p>
        </Link>
        <Link href='/inbox/buying' className={`${pathname == '/inbox/buying' ? 'text-white' : 'text-[#202020]'} relative w-[30%] bg-[#F8F8F8] font-raleway text-[16px] font-semibold py-1.5 rounded-[40px] flex items-center justify-center overflow-hidden`}>
            <div className={`bg-dark-blue absolute top-0 left-0 z-10 transition-Selling duration-300 ease-in-out h-full ${pathname == '/inbox/buying' ? 'w-full' : 'w-0'}`}></div>
            <p className='z-20'>Buying</p>
        </Link>
       </div>
    </header>
  )
}

export default LayoutHeader