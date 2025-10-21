import ProtectedRoute from '@/components/ProtectedRoute'
import React from 'react'

const layout = ({children} :{children: React.ReactNode}) => {
  return (
    <ProtectedRoute>
    <section className="w-full min-h-full px-4 [@media(min-width:375px)]:px-6 overflow-x-hidden">
    <h2 className='font-raleway font-bold text-[28px] tracking-[-0.28px] mt-2'>Orders</h2>

        {children}
        {/* <Navbar /> */}
    </section>
     </ProtectedRoute>
  )
}

export default layout