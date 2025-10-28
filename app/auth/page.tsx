'use client'
import React from 'react'
import Image from 'next/image'
import { loginArrow, logo } from '@/public/assets/images/exports'
import PrimaryButton from '@/components/PrimaryButton'
import { useRouter } from 'next/navigation'

const WelcomeScreen = () => {
    const router = useRouter();
    const handleSignUpClick = () => {
        router.push('/auth/signup')
    }
    const handleLoginClick = () => {
        router.push('/auth/login')
    }
  return (
    <section className='overflow-hidden w-[100vw] h-[100vh] flex flex-col items-center justify-end bg-white pb-14'>
        <div className='flex items-center justify-center flex-col'>
            <Image width={140} height={140} className='mt-6' src={logo} alt='Shopee Logo'/>
            <h1 className='font-bold text-[52px] mt-5 leading-[1]'>Shoppe</h1>
            <p className='mt-5 max-w-[249px] leading-[1.3] text-md font-light text-center'>The Next Gen Online Clothing Marketplace</p>
        </div>
        <div className='mt-18 flex flex-col items-center'>
            <PrimaryButton additionalStyles='' text="Let's get started" primaryButtonFunction={handleSignUpClick} />
            <button onClick={() => handleLoginClick()} className='group cursor-pointer flex gap-3 justify-center items-center text-[15px] font-light text-[#202020] mt-3'>
                <p>I already have an account</p>
                <span className='size-[30px] rounded-full bg-[#004CFF] group-hover:opacity-90 transition-all duration-200 ease-in-out flex justify-center items-center'>
                    <Image width={14.46} height={11.39} src={loginArrow} alt='login arrow' />
                </span></button>
        </div>
    </section>
  )
}

export default WelcomeScreen