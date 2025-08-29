'use client';
import React from 'react'
import { usePathname } from "next/navigation";
import {motion, AnimatePresence} from 'framer-motion'


const TransitionProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
          <motion.div
            key={pathname} // 👈 important for page transitions
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="min-h-screen"
          > 
            {children}
          </motion.div>
     </AnimatePresence>
  )
}

export default TransitionProvider