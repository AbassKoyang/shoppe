import Discover from '@/components/home-page/Discover'
import ProductCard from '@/components/ProductCard'
import SearchHeader from '@/components/SearchHeader'
import React from 'react'

const page = () => {
  return (
    <section className="w-full min-h-full overflow-x-hidden">
        <SearchHeader />
        <Discover/>
    </section>
  )
}

export default page