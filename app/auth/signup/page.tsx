'use client'
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {createUserWithEmailAndPassword} from 'firebase/auth'
import PrimaryButton from '@/components/PrimaryButton'
import Image from 'next/image'
import { eyeIcon, signUpBubble1, signUpBubble2, uploadPhotoIcon } from '@/public/assets/images/exports'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { saveUserToDB } from '@/services/users/api';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';
import { toastStyles } from '@/lib/utils';
import UploadImageButton from '@/components/UploadImageComponent';
import RetryToast from '@/components/RetryToast';




const page = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [hasImageUrlChanged, setHasImageUrlChanged] = useState(false);

    const router = useRouter();
    
    const formSchema = z.object({
        username: z.string().min(1, 'Name is required').min(3, 'Name must be at least 3 characters long.'),
        email: z.string().min(1, {error: 'Email is required.'}).email({error: 'Invalid email address.'}),
        password: z.string().min(1, 'Password is required').min(4, 'Password must be at least 4 characters').max(12, 'Password must not exceed 12 characters'),
        confirmPassword: z.string().min(1, 'Confirm password is required').min(4, 'Password must be at least 4 characters').max(12, 'Password must not exceed 12 characters'),
    }).refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match.',
        path: ['confirmPassword'],
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
    });
    const isDirty = form.formState.isDirty;


    const createUserMutaion = useMutation({
        mutationKey: ['createUser'],
        mutationFn: ({data, uid} : {data: any; uid: string}) => saveUserToDB(data, uid),
        onSuccess: (data) => {
            toast.success(`Signed up successfully`);
        }
    });

     const onSubmit = (data: z.infer<typeof formSchema>) => {
        handleSignUp(data);
    }
    
    
        const handleSignUp = async (data: z.infer<typeof formSchema>) => {
            const {username, email} = data;
            try {
                setLoading(true);
                const userCredential = await createUserWithEmailAndPassword(auth, email, data.password);
                const user = userCredential.user;
                if(user){
                    try {
                        await createUserMutaion.mutateAsync({
                            data: {
                                profile: {name: username.trim(), email: email.trim(), imageUrl: imageUrl, language: 'English'}, shopPrefrences: {country: 'Nigeria', currency: '₦ NGN', size: 'US'}, shippingAddress: {
                                    country: '', city: '', address: '', postalCode: '', phoneNumber: ''
                                }, 
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString()
                            },
                            uid: user.uid
                        })
                        router.replace('/')
                    } catch (dbError : any) {
                        if (dbError.code === 'unavailable' || dbError.message?.includes('network')) {
                            console.error('Error occured:', dbError);
                            toast.error(
                                <RetryToast label='Try again' message="Network error: Profile data couldn't be saved." retry={() => handleSignUp(data)} />,
                                toastStyles.error
                            );
                        } else {
                            toast.error(
                                <RetryToast label='Try again' message='Profile creation failed. Please contact support.' retry={() => handleSignUp(data)} />,
                                toastStyles.error
                            );
                        }
                    }
                }
            } catch (error : any) {
                console.log('Error details:', error);
                if(error.code === 'auth/email-already-in-use'){
                    toast.error(
                        <RetryToast label='Log in' message="This email is already registered. Please use a different email or try logging in." retry={() => router.push('/auth/login')} />, toastStyles.error);
                } else if (error.code === 'auth/weak-password') {
                    toast.error('Password is too weak. Please choose a stronger password.', toastStyles.errorSimple);
                } else if (error.code === 'auth/network-request-failed') {
                    toast.error(
                        <RetryToast label='Try again' message="Network error: Please check your internet connection and try again." retry={() => handleSignUp(data)} />, toastStyles.error
                    );
                }
                console.log(error);
            } finally {
                setLoading(false);
            }
        }; 
    
return (
    <section className='relative w-[100vw] min-h-dvh flex flex-col items-center justify-end bg-white pb-2'>
        <Image width={120} src={signUpBubble1} alt='bubble' className='absolute top-0 right-0' />
        <Image width={250} height={294} src={signUpBubble2} alt='bubble' className='absolute top-0 left-0' />
        <div className='w-full px-6 z-50'>
            <h1 className='text-[#202020] text-[50px] font-bold leading-[1.1]'>Create<br/>Account</h1>
            <UploadImageButton
            onComplete={(url: string) => {
            setImageUrl(`${url}?t=${Date.now()}`);
          }}
          buttonLabel={
            <div className='size-[90px] rounded-full overflow-hidden object-fill object-center'>
                <Image
              width={90}
              height={90}
              src={imageUrl || uploadPhotoIcon}
              alt="Upload profile photo"
              className=""
              unoptimized // ✅ Cloudinary already optimizes
            />
            </div>
          }
          className="outline-0 mt-8"
        />

            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='mt-6 w-full'>
                <FormField
                    control={form.control}
                    name='username'
                    render={({field}) => (
                        <FormItem className=''>
                            <FormControl>
                                <Input {...field} placeholder='Name' type='text' className='border-0 py-6 px-6 bg-gray-100 placeholder:text-gray-400 text-black/70 text-lg outline-0 focus-within:outline-2 outline-[#004CFF] rounded-full' />
                            </FormControl>
                            <FormMessage className='text-red-500' />
                        </FormItem>
                    )}
                />
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
                <FormField
                    control={form.control}
                    name='password'
                    render={({field}) => (
                        <FormItem className='mt-3'>
                            <FormControl>
                                <Input {...field} type={showPassword? 'text' : 'password'} placeholder='Password' className='border-0 py-6 px-6 bg-gray-100 placeholder:text-gray-400 text-black/70 text-lg outline-0 focus-within:outline-2 outline-[#004CFF] rounded-full' />
                            </FormControl>
                            <FormMessage className='text-red-500' />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='confirmPassword'
                    render={({field}) => (
                        <FormItem className='mt-3'>
                            <FormControl>
                                <div className='w-full flex items-center justify-between'>
                                <Input {...field} type={showPassword ? 'text' : 'password'} placeholder='Confirm Password' className='w-[90%] border-0 py-6 px-6 bg-gray-100 placeholder:text-gray-400 text-black/70 text-lg outline-0 focus-within:outline-2 outline-[#004CFF] rounded-full' />

                                <button type='button' onClick={() => {setShowPassword(!showPassword)}} className='outline-0 stroke-0'><Image width={18} src={eyeIcon} alt='Eye icons' /></button>
                                </div>
                            </FormControl>
                            <FormMessage className='text-red-500' />
                        </FormItem>
                    )}
                />
                <PrimaryButton disabled={loading || !isDirty} additionalStyles='mt-8' text={loading ? <LoaderCircle className='animate-spin' /> : 'Done'} type='submit' />
            </form>
            </Form>
            <div className='w-full flex items-center justify-center my-3'>
                <button type='button' onClick={() => {router.push('/auth')}} className='text-[#202020] text-[15px] font-light cursor-pointer'>Cancel</button>
            </div>
        </div>
    </section>
  )
}

export default page
