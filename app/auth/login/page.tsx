'use client'
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import z, { email } from 'zod';
import {User} from '@/services/users/types'

import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import PrimaryButton from '@/components/PrimaryButton';
import { defaultProfileAvatar, loginArrow, loginBubble1, loginBubble2, loginHeartIcon, loginProfilePic, logo } from '@/public/assets/images/exports';
import Image from 'next/image';
import { fetchUserByEmail } from '@/services/users/api';
import { LoaderCircle } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { PasswordOTP } from '@/components/password-otp';

const page = ({ searchParams }: { searchParams: { redirect?: string }) => {
  const [loading, setLoading] = useState(false);
  const [loginStep, setLoginStep] = useState(1);
  const [user, setUser] = useState<User | null>(null);
  const [password, setPassword] = useState('');
  const [isWrongPassword, setIsWrongPassword] = useState(false);


  const router = useRouter();

 const toastStyles = {
        error: {
            position: "top-center" as const,
            autoClose: false as const,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light" as const,
            style: {
                background: '#ffffff',
                color: '#dc2626',
                border: '2px solid #dc2626',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '500',
                maxWidth: '95%',                
            }
        },
        errorSimple: {
            position: "top-center" as const,
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light" as const,
            style: {
                background: '#ffffff',
                color: '#dc2626',
                border: '2px solid #dc2626',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '500'
            }
        }
    };

    const formSchema = z.object({
        email: z.string().min(1, {error: 'Email is required.'}).email({error: 'Invalid email address.'}),
    });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
        },
    });


     const onSubmit = (data: z.infer<typeof formSchema>) => {
        handleFetchUserByEmail(data);
    }
    
    
        const handleFetchUserByEmail = async (data: z.infer<typeof formSchema>) => {
            const {email} = data;
            console.log(email);
            setLoading(true);
                    try {
                         const user = await fetchUserByEmail(email);
                        if(!user){
                            toast.error(
                                <div>
                                    <p>No account found with this email address.</p>
                                    <button 
                                        onClick={() => router.push('/auth/signup')}
                                        className="cursor-pointer mt-2 px-4 py-2 bg-[#004CFF] text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        Create Account
                                    </button>
                                </div>,
                                toastStyles.error
                            );
                            return;
                        }
                        setUser(user);
                        setLoginStep(2);
                        
                    } catch (err : any) {
                        const code = err?.code;
                        const msg = String(err?.message || '').toLowerCase();
                        if (code === 'unavailable' || msg.includes('network')) {
                          toast.error(
                            <div>
                              <p>Network error: Please check your connection and try again.</p>
                              <button onClick={() => handleFetchUserByEmail(data)}
                                      className="cursor-pointer mt-2 px-4 py-2 bg-[#004CFF] text-white rounded-lg hover:bg-blue-600 transition-colors">
                                Try Again
                              </button>
                            </div>,
                            toastStyles.error
                          );
                          return;
                        }
                    } finally {
                setLoading(false);
            }
        }; 

        const handleUserLogin = async () => {
            try {
                await signInWithEmailAndPassword(auth, user?.profile.email!, password);
                toast.success("Signed in successfully!");
                let redirectPath = searchParams.get("redirect") || "/";
                if (redirectPath === "/login" || redirectPath === "/signup") {
                    redirectPath = "/"; // or your default home
                }
                router.push(redirectPath);
              } catch (error: any) {
                console.log(error, error.code);
                switch (error.code) {
                  case "auth/invalid-credential":
                    setIsWrongPassword(true);
                    toast.error("Incorrect password.", toastStyles.error);
                    break;
                  case "auth/user-disabled":
                    toast.error("This account has been disabled.", toastStyles.error);
                    break;
                  case "auth/user-not-found":
                    toast.error("No user found with this email.", toastStyles.error);
                    break;
                  case "auth/wrong-password":
                    toast.error("Incorrect password.", toastStyles.error);
                    break;
                  default:
                    toast.error("Something went wrong. Please try again.", toastStyles.error);
                }
                
            } finally {

            }
        };

  return (
    <section className={`relative w-[100vw] min-h-dvh flex flex-col items-center ${loginStep == 1? 'justify-end' : 'justify-start'} bg-white pb-4`}>
        <Image width={330} src={loginBubble1} alt='bubble' className='absolute top-0 left-0' />
       {loginStep == 1 ? 
       (<>
        <Image width={70} src={loginBubble2} alt='bubble' className='absolute top-[40%] -translate-y-[40%] right-0' />

        <div className='w-full px-6 z-50'>
            <div className='mb-8 flex items-center justify-center'>
              <Image width={140} height={140} src={logo} alt='bubble' className='' />
            </div>
            <h1 className='text-[#202020] text-[50px] font-bold leading-[1.1]'>Login</h1>
            <div className='flex items-center justify-start mt-2 gap-1'>
             <p className='text-[19px] text-[#202020] font-light'>Good to see you back!</p>
             <Image src={loginHeartIcon} alt='Heart Icon' />
            </div>

            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='mt-6 w-full'>
                <FormField
                    control={form.control}
                    name='email'
                    render={({field}) => (
                        <FormItem className='mt-3'>
                            <FormControl>
                                <Input {...field} placeholder='Email' type='email' className='border-0 py-6 px-6 bg-gray-100 placeholder:text-gray-400 text-black/70 text-lg outline-0 focus-within:outline-2 outline-[#004CFF] rounded-full' />
                            </FormControl>
                            <FormMessage className='text-red-500' />
                        </FormItem>
                    )}
                />
                <PrimaryButton additionalStyles='mt-8' text={loading ? <LoaderCircle className='animate-spin' /> : 'Next'} primaryButtonFunction={onSubmit} />
            </form>
            </Form>
            <div className='w-full flex items-center justify-center my-3'>
                <button type='button' onClick={() => {router.push('/auth')}} className='text-[#202020] text-[15px] font-light cursor-pointer'>Cancel</button>
            </div>
        </div>
    </>) : (
        <>
         <div className='w-full min-h-dvh px-6 flex flex-col items-center justify-between z-50'>
            <div className='mb-8 flex flex-col items-center justify-center mt-20'>
              <Image width={125} height={125} src={user?.profile.imageUrl || defaultProfileAvatar} alt='Profile picture' className='border-white border-8 rounded-full' />
              <h1 className='text-[#202020] text-[28px] font-bold leading-[1.1] mt-8'>Hello, {user?.profile.name.split(' ')[0]}!</h1>
              <p className='font-light text-xl text-black mt-14 mb-6'>Type your password</p>
              <PasswordOTP 
                value={password}
                onChange={setPassword}
                maxLength={6}
                onComplete={handleUserLogin}
                disabled={loading}
                wrongPassword={isWrongPassword}
             />
             {isWrongPassword ? (
              <button onClick={() => router.push('/auth/password-recovery')} className='cursor-pointer border-0 outline-none font-normal text-lg text-black my-6'>Forgot your password?</button>
             ) : (
              <p className='font-normal text-xs text-black my-6'>Enter your 6-charcater password</p>
             )}
            </div>

            <div className='mt-18 flex flex-col items-center'>
                <button onClick={() => router.push('/auth/login')} className='group cursor-pointer flex gap-3 justify-center items-center text-[15px] font-light text-[#202020] mt-3'>
                    <p>Not You?</p>
                    <span className='size-[30px] rounded-full bg-[#004CFF] group-hover:opacity-90 transition-all duration-200 ease-in-out flex justify-center items-center'>
                        <Image width={14.46} height={11.39} src={loginArrow} alt='login arrow' />
                    </span></button>
                </div>
         </div>
        </>
       )}
    </section>
  )
}

export default page
