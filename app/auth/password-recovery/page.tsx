'use client'
import { PasswordOTP } from '@/auth/components/password-otp';
import PrimaryButton from '@/auth/components/PrimaryButton';
import { Input } from '@/components/ui/input';
import { auth } from '@/lib/firebase';
import { defaultProfileAvatar, loginArrow, loginProfilePic, resetPasswordBubble } from '@/public/assets/images/exports';
import { sendPasswordResetEmail } from 'firebase/auth';
import { LoaderCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

const page = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handlePasswordReset = async (email: string) => {
        if(email){
        setLoading(true);
          try {
            await sendPasswordResetEmail(auth, email, {
                url: "http://localhost:3000/auth/login",
                handleCodeInApp: true, // recommended
              });

              setEmail('');
          
              toast.success("Password reset email sent! Check your inbox.", {
                position: "top-right",
              });
        } catch (err: any) {
            switch (err.code) {
              case "auth/invalid-email":
                toast.error("Invalid email address.");
                break;
              case "auth/user-not-found":
                toast.error("No account found with this email.");
                break;
              default:
                toast.error("Something went wrong. Please try again.");
            }
          } finally {
            setLoading(false);
          }
        }
    };
  return (
    <section className={`relative w-[100vw] min-h-dvh flex flex-col items-center bg-white pb-4`}>
        <Image width={400} height={380} src={resetPasswordBubble} alt='bubble' className='absolute top-0 right-0' />
        <div className='w-full min-h-dvh px-6 flex flex-col items-center justify-between z-50'>
            <div className='mb-8 flex flex-col items-center justify-center mt-36'>
            <Image width={120} src={defaultProfileAvatar} alt='Profile picture' className='border-white border-8 rounded-full' />
            <h1 className='text-[#202020] text-[21px] font-bold leading-[1.1] mt-5'>Password Recovery</h1>
            <p className='font-light text-xl text-black my-6 text-center'>Enter the email linked to your account. You will receeive a recovery link (check spam).</p>
            </div>

            <div>
                <form>
                    <Input required value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' type='email' className='mt-3 border-0 py-6 px-6 bg-gray-100 placeholder:text-gray-400 text-black/70 text-lg outline-0 focus-within:outline-2 outline-[#004CFF] rounded-full' />
                    <button type='submit' onClick={(e) =>{e.preventDefault(); handlePasswordReset(email)}} className={`mt-8 w-full cursor-pointer bg-dark-blue hover:opacity-90 transition-all duration-200 ease-in-out text-[#F3F3F3] text-[22px] font-extralight flex items-center justify-center rounded-xl px-18 py-3`}>
                    {loading ? <LoaderCircle className='animate-spin' /> : 'Next'}
                    </button>
                </form>
                <div className='w-full flex items-center justify-center my-3'>
                    <button type='button' onClick={() => {router.push('/auth')}} className='text-[#202020] text-[15px] font-light cursor-pointer'>Cancel</button>
                </div>
            </div>
    </div>
 </section>
  )
}

export default page;