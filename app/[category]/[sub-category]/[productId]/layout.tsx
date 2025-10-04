import ProtectedRoute from '@/components/ProtectedRoute'
import React from 'react'

const layout = ({children} :{children: React.ReactNode}) => {
  return (
    // <ProtectedRoute>
    <section className="w-full min-h-full overflow-x-hidden">
        {children}
    </section>
    // </ProtectedRoute>
  )
}

export default layout