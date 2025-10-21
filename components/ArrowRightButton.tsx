import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const ArrowRightButton = ({url} : {url?: string}) => {
  return (
    <Link href={url ? url : ''} className="size-[30px] rounded-full bg-dark-blue flex items-center justify-center cursor-pointer">
         <ArrowRight className="text-white size-[16px]" />
    </Link>
  )
}

export default ArrowRightButton