import LayoutHeader from '@/components/inbox/LayoutHeader'
import ProtectedRoute from '@/components/ProtectedRoute'
import { InboxProvider } from '@/lib/contexts/inbox-context'
import React from 'react'

const layout = ({children} :{children: React.ReactNode}) => {
  return (
    <ProtectedRoute>
    <InboxProvider>
       <section className="w-full min-h-full px-4 [@media(min-width:375px)]:px-6 overflow-x-hidden">
        <LayoutHeader/>
        {children}
      </section>
    </InboxProvider>
    </ProtectedRoute>
  )
}

export default layout