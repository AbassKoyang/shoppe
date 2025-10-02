import Link from 'next/link';
import React from 'react';
import {motion} from 'framer-motion'

const SubCategoryAvatar = ({subcat, link}:{subcat:string; link: string}) => {
  return (
    <Link href={link} className="flex flex-col items-center">
        <div className="size-[60px] border-5 border-white shadow-[0_5px_10px_0_rgba(0,0,0,0.12)] rounded-full object-contain object-center overflow-hidden">
            <img src="/assets/images/bags-1.png" alt="Clothing image" className="size-full"/>
        </div>

        <div className='w-[38px] overflow-x-hidden flex items-center gap-3'>
        <motion.div
        className="whitespace-nowrap text-xs font-raleway font-medium mt-2"
        animate={{ x: ["0%", "-80%"] }}
        transition={{
          duration: 5,
          ease: "linear", 
          repeat: Infinity,
          repeatType: 'reverse'
        }}>
                {subcat}
            </motion.div>
         </div>
    </Link>
  )
}

export default SubCategoryAvatar