'use client'
import ArrowRightButton from '@/components/ArrowRightButton'
import CategoryPreview from '@/components/CategoryPreview'
import HomeHeader from '@/components/HomeHeader'
import SponsoredBanner from '@/components/SponsoredBanner'
import { CATEGORIES } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const page = () => {
    const router = useRouter();
  return (
    <section className="w-full min-h-full px-4 [@media(min-width:375px)]:px-6 overflow-x-hidden scrollbar-hide">
      <HomeHeader />
      <SponsoredBanner />
      <div className="w-full mt-6">
        <div className="w-full flex items-center gap-3">
          <button onClick={() => router.back()} className="flex items-center justify-center">
            <ArrowLeft className="size-[25px]" />
          </button>
          <h3 className="text-[22px] font-raleway font-bold text-[#202020]">All Categories</h3>
        </div>
        <div className="w-full flex items-start justify-between flex-wrap mt-3 mb-[100px]">
            {CATEGORIES.map((cat) => (
          <CategoryPreview label={cat.label}  images={cat.images}/>
            ))}
        </div>
      </div>
    </section>
  )
}

export default page