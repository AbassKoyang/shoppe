import ProductCard from '@/components/ProductCard'
import SearchHeader from '@/components/SearchHeader'
import React from 'react'

const page = () => {
  return (
    <section className="w-full min-h-full px-4 [@media(min-width:375px)]:px-6 overflow-x-hidden">
        <SearchHeader />
        <section className="w-full mt-8 mb-[300px]">
        <div className="w-full">
          <h3 className="text-[22px] font-raleway font-bold text-[#202020]">Discover</h3>
        </div>

        <div className="min-w-full mt-2">
        <div className="w-full overflow-x-auto flex items-start gap-1.5 carousel-container scrollbar-hide">
              <ProductCard/>
              <ProductCard/>
              <ProductCard/>
              <ProductCard/>
              <ProductCard/>
              <ProductCard/>
              <ProductCard/>
          </div>
        </div>
      </section>
    </section>
  )
}

export default page