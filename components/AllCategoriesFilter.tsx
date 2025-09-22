import { X } from 'lucide-react'
import React from 'react'
import {motion} from 'framer-motion';
import CategoryAccordion from './CategoryAccordion';

const AllCategoriesFilterModal = ({open, closeModal}:{open: boolean; closeModal: () => void}) => {
  return (
    <motion.section
    initial={{x: 0}}
    animate={{x:open ? '0%' : '100%'}}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
     className='w-full h-fit absolute bg-white z-30'>
        <div className="w-full flex items-center justify-between mt-6 mb-3">
            <h2 className='font-bold font-raleway text-[28px] text-[#202020] m-0 leading-0'>All Categories</h2>
            <button onClick={closeModal} className='flex items-center justify-center'><X strokeWidth={2} className='size-[25px] text-black' /></button>
        </div>
        <CategoryAccordion />
        <CategoryAccordion />
        <CategoryAccordion />
        <CategoryAccordion />
        <CategoryAccordion />
    </motion.section>
  )
}

export default AllCategoriesFilterModal