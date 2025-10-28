'use client';
import React, { useState } from 'react';
import SettingsLink from './components/SettingsLink';
import { useAuth } from '@/lib/contexts/auth-context';
import ProtectedRoute from '@/components/ProtectedRoute';
import { deleteUser, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';
import { usePathname, useRouter } from 'next/navigation';
import ConfirmSignout from './components/ConfirmSignOut';
import ConfirmDeleteAccount from './components/ConfirmDeleteAccount';
import { useMutation } from '@tanstack/react-query';
import { deleteAccount } from '@/services/users/api';
import RetryToast from '@/components/RetryToast';
import { toastStyles } from '@/lib/utils';

const page = () => {
    const {user}  = useAuth()!;
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(false);
    const [isSignoutModalOpen, setIsSignoutModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteAccountLoading, setDeleteAccountLoading] = useState(false);

    const deleteAccountMutation = useMutation({
      mutationKey: ['deleteAccount'],
      mutationFn: (uid : string) => deleteAccount(uid),
      onSuccess: (data) => {
          toast.success(`Account deleted succesfully.`);
          router.replace('/auth/signup')
      }
  });

  const handleDeleteAccount = async (uid: string) => {
    const user = auth.currentUser!;
    try {
        setDeleteAccountLoading(true);
        await deleteUser(user);
        await deleteAccountMutation.mutateAsync(uid);
    } catch (error: any) {
        console.error("❌ Error deleting account:", error);
  
      if (error?.code === "permission-denied") {
        toast.error("You don’t have permission to delete this account.");
      } else if (error?.message?.includes("network")) {
        toast.error("Network error — check your connection and try again.");
      } else if (error?.code === "auth/requires-recent-login"){
        toast.error(<RetryToast retry={() => router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`)} label='Log in' message='Failed to delete account. You need to be recently logged in.'/>, toastStyles.error)
      } else {
        toast.error("Something went wrong while deleting your account. Please try again.");
      }
    }finally {
        setDeleteAccountLoading(false);
    };
  };
    const handleSignOut =  async () => {
      setLoading(true);
      try {
        await signOut(auth);
        router.replace('/auth/login');
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
        <SettingsLink href='/settings/bank-details' text='Bank Details' />

        <h3 className='text-[20px] font-family-raleway font-extrabold mb-1 mt-7 text-[#202020]'>Shop</h3>
        <SettingsLink href='/settings/country' text='States' extraText={user?.shopPrefrences.country} />
        <SettingsLink href='/settings/currency' text='Currency' extraText={user?.shopPrefrences.currency} />
        <SettingsLink href='/settings/size' text='Sizes' extraText={user?.shopPrefrences.size} />
        <SettingsLink href='' text='Terms & Conditions' />

        <h3 className='text-[20px] font-family-raleway font-extrabold mb-1 mt-7 text-[#202020]'>Account</h3>
        <SettingsLink href='/settings/language' text='Language' extraText={user?.profile.language} />
        <SettingsLink href='' text='About Shoppe' />

        <div className='w-full my-8 flex flex-col gap-4 items-start'>
          <button onClick={() => setIsSignoutModalOpen(true)} className='text-red-400 text-lg cursor-pointer hover:text-red-700 transition-all duration-200 ease-in-out'>Sign Out</button>
          <button onClick={() => setIsDeleteModalOpen(true)} className='text-red-400 text-sm cursor-pointer hover:text-red-700 transition-all duration-200 ease-in-out'>Delete my account</button>
        </div>

        <h1 className='text-black text-[24px] font-extrabold font-raleway mt-8'>Shoppe</h1>
        <p className='text-black text-xs font-nunito-sans font-normal'>Version 1.0 August, 2025</p>
        <ConfirmSignout isSigningOut={loading} signOut={() => handleSignOut()} open={isSignoutModalOpen} closeModal={() => setIsSignoutModalOpen(false)}/>
        <ConfirmDeleteAccount isDeleting={deleteAccountLoading} deleteAccount={() => handleDeleteAccount(user?.uid || '')} open={isDeleteModalOpen} closeModal={() => setIsDeleteModalOpen(false)}/>
    </section>
    </ProtectedRoute>
  )
}

export default page