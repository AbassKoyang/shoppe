'use client';
import React from 'react';
import SettingsLink from './components/SettingsLink';
import { useAuth } from '@/lib/contexts/auth-context';
import ProtectedRoute from '@/components/ProtectedRoute';

const page = () => {
    const {user}  = useAuth()!;
    console.log('Welcome page: Auth state', { user});

  return (
    <ProtectedRoute>
    <section className='w-full mt-6'>
        <h3 className='text-[20px] font-family-raleway font-extrabold mb-1 text-[#202020]'>Personal</h3>
        <SettingsLink href='/settings/profile' text='Profile' />
        <SettingsLink href='/settings/shipping-address' text='Shipping Address' />
        <SettingsLink href='/settings/payment-methods' text='Payment Methods' />

        <h3 className='text-[20px] font-family-raleway font-extrabold mb-1 mt-7 text-[#202020]'>Shop</h3>
        <SettingsLink href='/settings/country' text='Country' extraText={user?.shopPrefrences.country} />
        <SettingsLink href='/settings/currency' text='Currency' extraText={user?.shopPrefrences.currency} />
        <SettingsLink href='/settings/sizes' text='Sizes' extraText={user?.shopPrefrences.size} />
        <SettingsLink href='/settings/terms-and-conditions' text='Terms & Conditions' />

        <h3 className='text-[20px] font-family-raleway font-extrabold mb-1 mt-7 text-[#202020]'>Account</h3>
        <SettingsLink href='/settings/language' text='Language' extraText={user?.profile.language} />
        <SettingsLink href='/settings/about' text='About Shoppe' />

        <button className='mt-8 text-red-400 text-sm cursor-pointer hover:text-red-700 transition-all duration-200 ease-in-out'>Delete my account</button>

        <h1 className='text-black text-[24px] font-extrabold font-raleway mt-8'>Shoppe</h1>
        <p className='text-black text-xs font-nunito-sans font-normal'>Version 1.0 August, 2025</p>
    </section>
    </ProtectedRoute>
  )
}

export default page