import { ArrowRight } from 'lucide-react'
import React from 'react'

const ArrowRightButton = () => {
  return (
    <button className="size-[30px] rounded-full bg-dark-blue flex items-center justify-center">
         <ArrowRight className="text-white size-[16px]" />
    </button>
  )
}

export default ArrowRightButton