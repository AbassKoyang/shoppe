'use client';
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const LayoutHeader = () => {
    const router = useRouter();
  return (
    <div className="w-full flex items-center gap-3 mb-2">
        <button onClick={() => router.back()} className="flex items-center justify-center cursor-pointer">
            <ArrowLeft className="size-[30px]" />
        </button>
        <h1 className='font-bold font-raleway text-[30px] leading-[1px]'>Settings</h1>
    </div>
  )
}

export default LayoutHeader