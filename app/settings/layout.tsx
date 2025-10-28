import React from 'react'
import LayoutHeader from './components/LayoutHeader'

const layout = ({children} : {children: React.ReactNode}) => {
  return (
    <section className='w-full min-h-dvh bg-white px-6 pt-4'>
      <LayoutHeader />
        {children}
    </section>
  )
}

export default layout