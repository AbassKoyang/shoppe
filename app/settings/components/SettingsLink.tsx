import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const SettingsLink = ({href, text, extraText} : {href: string; text: string; extraText?: string;}) => {
  return (
    <Link className='w-full py-4.5 bg-white border-b border-gray-300 flex items-center justify-between' href={href}>
        <p className='font-nunito-sans text-[16px] font-semibold'>{text}</p>
       <div className='flex items-center gap-3'>
        {extraText && (<p className='font-nunito-sans text-[15px] font-normal'>{extraText}</p>)}
        <ChevronRight />      
        </div>
    </Link>
  )
}

export default SettingsLink