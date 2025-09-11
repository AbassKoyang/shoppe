'use client';
import React, { useState } from 'react';
import SettingsLink from './components/SettingsLink';
import { useAuth } from '@/lib/contexts/auth-context';
import ProtectedRoute from '@/components/ProtectedRoute';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import ConfirmSignout from './components/ConfirmSignOut';

const page = () => {
    const {user}  = useAuth()!;
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    console.log('Welcome page: Auth state', { user});
    const handleSignOut =  async () => {
      setLoading(true);
      try {
        await signOut(auth);
        router.replace('/auth/login')
      } catch (error) {
        toast.error(`Failed to sign out. ${error}`)
      }finally {
        setLoading(false);
      }
    }

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
        <SettingsLink href='/settings/size' text='Sizes' extraText={user?.shopPrefrences.size} />
        <SettingsLink href='/settings/terms-and-conditions' text='Terms & Conditions' />

        <h3 className='text-[20px] font-family-raleway font-extrabold mb-1 mt-7 text-[#202020]'>Account</h3>
        <SettingsLink href='/settings/language' text='Language' extraText={user?.profile.language} />
        <SettingsLink href='/settings/about' text='About Shoppe' />

        <div className='w-full my-8 flex flex-col gap-4 items-start'>
          <button onClick={() => setIsModalOpen(true)} className='text-red-400 text-lg cursor-pointer hover:text-red-700 transition-all duration-200 ease-in-out'>Sign Out</button>
          <button className='text-red-400 text-sm cursor-pointer hover:text-red-700 transition-all duration-200 ease-in-out'>Delete my account</button>
        </div>

        <h1 className='text-black text-[24px] font-extrabold font-raleway mt-8'>Shoppe</h1>
        <p className='text-black text-xs font-nunito-sans font-normal'>Version 1.0 August, 2025</p>
        <ConfirmSignout isSigningOut={loading} signOut={() => handleSignOut()} open={isModalOpen} closeModal={() => setIsModalOpen(false)}/>
    </section>
    </ProtectedRoute>
  )
}

export default page