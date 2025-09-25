import { X } from 'lucide-react'
import React from 'react'
import {motion} from 'framer-motion';
import CategoryAccordion from './CategoryAccordion';
import { CATEGORIES } from '@/lib/utils';

const AllCategoriesFilterModal = ({open, closeModal}:{open: boolean; closeModal: () => void}) => {
  return (
    <motion.section
    initial={{x: 0}}
    animate={{x:open ? '0%' : '100%'}}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
    className='w-[100vw] h-dvh fixed top-0 left-0 z-40 flex items-start justify-end'>
        <div className="size-full z-10 absolute top-0 left-0 bg-[#E9E9E9] opacity-75"></div>
        <div className="w-[90%] h-full bg-white z-20 pl-4 [@media(min-width:375px)]:pl-6 pr-2 [@media(min-width:375px)]:pr-4">
            <div className="w-full flex items-center justify-between mt-6 mb-5">
                <h2 className='font-bold font-raleway text-[26px] text-[#202020] m-0 leading-0'>All Categories</h2>
                <button onClick={closeModal} className='flex items-center justify-center cursor-pointer'><X strokeWidth={2} className='size-[23px] text-black' /></button>
            </div>
            <div className="w-full h-[90%] overflow-y-scroll">
                {CATEGORIES.map((cat) => (
                <CategoryAccordion key={cat.label} category={cat.label} />
                ))}
            </div>
        </div>
    </motion.section>
  )
}

export default AllCategoriesFilterModal