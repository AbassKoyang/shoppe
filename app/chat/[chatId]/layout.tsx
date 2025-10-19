import ProtectedRoute from '@/components/ProtectedRoute'
import React from 'react'

const layout = ({children} :{children: React.ReactNode}) => {
  return (
    <ProtectedRoute>
    <section className="w-full min-h-full overflow-x-hidden bg-[#F9F9F9]">
        {children}
        {/* <Navbar /> */}
    </section>
    </ProtectedRoute>
  )
}

export default layout