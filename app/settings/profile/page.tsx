'use client';
import { useAuth } from '@/lib/contexts/auth-context';
import { defaultProfileAvatar } from '@/public/assets/images/exports';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {z} from 'zod';
import { BiSolidPencil } from "react-icons/bi";
import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import ProtectedRoute from '@/components/ProtectedRoute';
import { LoaderCircle } from 'lucide-react';
import PrimaryButton from '@/components/PrimaryButton';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { toastStyles } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { updateUserProfile } from '@/services/users/api';
import UploadImageButton from '@/components/UploadImageComponent';
import RetryToast from '@/components/RetryToast';

const page = () => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [hasImageUrlChanged, setHasImageUrlChanged] = useState(false);
    const {user} = useAuth();
    console.log(user);


    const profileSchema = z.object({
        name: z.string().min(1, 'Name is required').min(3, 'Name must be at least 3 characters long.'),
        email: z.string().min(1, {error: 'Email is required.'}).email({error: 'Invalid email address.'}),
        imageUrl: z.string().url().optional(),
    });

    const form = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
          name: user?.profile?.name || '',
          email: user?.profile?.email || '',
        }
      });
      const watchedValues = form.watch();
    
      const originalValues = {
          name: user?.profile?.name || '',
          email: user?.profile?.email || '',
      };
  
      const hasChanges = watchedValues.name !== originalValues.name || 
                        watchedValues.email !== originalValues.email;

      useEffect(() => {
        if(user){
            setImageUrl(user.profile.imageUrl || '');
        }
      }, [user]);
      
      useEffect(() => {
        if (user?.profile) {
            form.reset({
                name: user.profile.name || '',
                email: user.profile.email || '',
            });
        }
    }, [user, form]);
  

    const onSubmit = (data: z.infer<typeof profileSchema>) => {
        console.log('submitted')
        handleUserProfileUpdate(data);
    }

    const updateUserProfileMutation = useMutation({
        mutationKey: ['updateUserProfile'],
        mutationFn: ({uid, name, email, imageUrl, language} : {uid: string; name: string; email: string; imageUrl: string; language: 'English' | 'Français'}) =>  updateUserProfile({uid, name, email, imageUrl, language}),
        onSuccess: () => {
            toast.success('User profile updated successfully');
        }
    })

    const handleUserProfileUpdate = async (data: z.infer<typeof profileSchema>) => {
        const {name, email} = data;
        const uid = user?.uid;
        const language = user?.profile.language || 'English';
        if ((hasChanges || hasImageUrlChanged) && uid) {
            setLoading(true);
            try {
                await updateUserProfileMutation.mutateAsync({uid, name, email, imageUrl, language});
            } catch (error: any) {
                console.error('Profile update error:', error);
                
                if (error.code === 'permission-denied') {
                    toast.error('You do not have permission to update your profile');
                } else if (error.code === 'unavailable' || error.message?.includes('network')) {
                    toast.error(
                        <RetryToast label='Try again' message="Network error: Profile couldn't be updated" retry={() => handleUserProfileUpdate(data)} />,
                        toastStyles.error
                    );
                } else if (error.message?.includes('email')) {
                    toast.error('Email update failed. Please try again.');
                } else if (error.message?.includes('name')) {
                    toast.error('Name update failed. Please try again.');
                } else {
                    toast.error('Failed to update profile. Please try again.');
                }
            } finally{
                setLoading(false);
            }
        }
    };

  return (
    <ProtectedRoute>
        <section className='w-full'>
            <div>
                <h4 className='text-[16px] font-medium font-raleway'>Your Profile</h4>
                <div className='relative mt-4 size-[115px] rounded-full border-[6px] border-white shadow-md'>
                    <UploadImageButton onComplete={
                        (url) => {
                            console.log("Uploaded Image URL:", url);
                            setImageUrl(url); 
                            setHasImageUrlChanged(true);
                          }
                    } buttonLabel={<BiSolidPencil className='size-[18px] text-white' />} className="absolute top-0 right-0 z-20 size-[35px] rounded-full border-[4px] border-white shadow-md flex items-center justify-center bg-dark-blue" />
 
                    <div className='size-full rounded-full overflow-hidden object-contain object-center'>
                    <Image key={imageUrl} src={imageUrl ? imageUrl : defaultProfileAvatar} width={115} height={115}  className='size-full z-10' alt='Profile avatar' />
                    </div>
                </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='mt-6 w-full'>
                    <div className='w-full'>
                    <FormField
                            control={form.control}
                            name='name'
                            render={({field}) => (
                                <FormItem className=''>
                                    <FormControl>
                                        <Input {...field} placeholder='Name' type='text' className='border-0 pt-7 pb-6 px-6 bg-gray-100 placeholder:text-gray-400 text-black/70 text-lg outline-0 focus-within:outline-2 outline-[#004CFF] rounded-xl' />
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
                                        <Input {...field} placeholder='Email' type='email' className='border-0 pt-7 pb-6 px-6 bg-gray-100 placeholder:text-gray-400 text-black/70 text-lg outline-0 focus-within:outline-2 outline-[#004CFF] rounded-xl' />
                                    </FormControl>
                                    <FormMessage className='text-red-500' />
                                </FormItem>
                            )}
                        />
                    </div>

                        <div className={`absolute bottom-5 left-0 w-full px-6`}>
                        <PrimaryButton additionalStyles='w-full'  text={loading ? <LoaderCircle className='animate-spin' /> : 'Save Changes'} disabled={!hasChanges && !hasImageUrlChanged} primaryButtonFunction={() => form.handleSubmit(onSubmit)()} />
                    </div>
                    </form>
            </Form>
            </div>
        </section>
  </ProtectedRoute>
  )
};

export default page