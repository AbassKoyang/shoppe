import React from 'react'

const layout = ({children} : {children: React.ReactNode}) => {
  return (
    <section className='w-full min-h-dvh bg-white px-6 pt-8'>
        <h1 className='font-bold font-raleway text-[30px]'>Settings</h1>
        {children}
    </section>
  )
}

export default layout