'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { CountryType } from '@/services/users/types';
import CountryCombobox from '../components/CountryCombobox';
import { Input } from '@/components/ui/input';
import PrimaryButton from '@/components/PrimaryButton';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/contexts/auth-context';
import { useMutation } from '@tanstack/react-query';
import { updateUserShippingAddress } from '@/services/users/api';
import { toast } from 'react-toastify';
import RetryToast from '@/components/RetryToast';
import { states, toastStyles } from '@/lib/utils';
import { useRouter } from 'next/navigation';

  
const schema = z.object({
  country: z.string().min(1, "Please select a country"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  phoneNumber: z.string('Invalid phoneNumber').optional(),
})

type FormValues = z.infer<typeof schema>

const page = () => {
    const {user} = useAuth();
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
          country: user?.shippingAddress.country || "",
          address: user?.shippingAddress.address || "",
          city: user?.shippingAddress.city || "",
          postalCode: user?.shippingAddress.postalCode || "",
          phoneNumber: user?.shippingAddress.phoneNumber || ""
        },
    });

    const watchedValues = form.watch();
    
      const originalValues = {
        country: user?.shippingAddress.country || "",
        address: user?.shippingAddress.address || "",
        city: user?.shippingAddress.city || "",
        postalCode: user?.shippingAddress.postalCode || "",
        phoneNumber: user?.shippingAddress.phoneNumber || ""
      };
  
      const hasChanges = watchedValues.country !== originalValues.country || 
                        watchedValues.address !== originalValues.address || 
                        watchedValues.city !== originalValues.city || 
                        watchedValues.postalCode !== originalValues.postalCode || 
                        watchedValues.phoneNumber !== originalValues.phoneNumber;
      
      useEffect(() => {
        if (user?.shippingAddress) {
            form.reset({
                country: user?.shippingAddress.country || "",
                address: user?.shippingAddress.address || "",
                city: user?.shippingAddress.city || "",
                postalCode: user?.shippingAddress.postalCode || "",
                phoneNumber: user?.shippingAddress.phoneNumber || ""
            });
        }
    }, [user, form]);

    const updateUserProfileMutation = useMutation({
        mutationKey: ['updateUserShippingAddress'],
        mutationFn: ({uid, country, address, city, postalCode, phoneNumber} : {uid: string; country: string; address: string; city: string; postalCode: string; phoneNumber?: string;}) =>  updateUserShippingAddress({
            uid,
            country,
            address,
            city,
            postalCode,
            phoneNumber}),
        onSuccess: () => {
            toast.success('User shipping address updated successfully');
        }
    })

    const handleUserShippingAddressUpdate = async (data: z.infer<typeof schema>) => {
        const {
            country,
            address,
            city,
            postalCode,
            phoneNumber
        } = data;
        const uid = user?.uid;
        if (hasChanges && uid) {
            setLoading(true);
            try {
                await updateUserProfileMutation.mutateAsync({uid,
                    country,
                    address,
                    city,
                    postalCode,
                    phoneNumber});
                router.push('/settings')
            } catch (error: any) {
                console.error('Shipping address update error:', error);
                
                if (error.code === 'permission-denied') {
                    toast.error('You do not have permission to update your shipping address');
                } else if (error.code === 'unavailable' || error.message?.includes('network')) {
                    toast.error(
                        <RetryToast label='Try again' message="Network error: Shipping couldn't be updated" retry={() => handleUserShippingAddressUpdate(data)} />,
                        toastStyles.error
                    );
                } else if (error.message?.includes('country')) {
                    toast.error('Country update failed. Please try again.');
                } else if (error.message?.includes('city')) {
                    toast.error('City update failed. Please try again.');
                } else if (error.message?.includes('address')) {
                    toast.error('Adsress update failed. Please try again.');
                } else if (error.message?.includes('postalCode')) {
                    toast.error('Postal code update failed. Please try again.');
                } else if (error.message?.includes('phoneNumber')) {
                    toast.error('Phone number update failed. Please try again.');
                } else {
                    toast.error('Failed to update Shipping Address. Please try again.');
                }
            } finally{
                setLoading(false);
            }
        }
    };

    const onSubmit = (data: z.infer<typeof schema>) => {
        console.log('submitted')
        handleUserShippingAddressUpdate(data);
    }

  return (
    <ProtectedRoute>
        <section className="w-full">
        <h4 className='text-[16px] font-medium font-raleway'>Shipping Address</h4>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
                <FormItem className='mt-8'>
                <FormLabel className='text-[14px] font-nunito-sans font-semibold leading-0 mb-2.5'>State</FormLabel>
                <FormControl>
                    <CountryCombobox
                    countries={states}
                    value={states.find((b) => b.value === field.value) || null}
                    onChange={(selected) => field.onChange(selected?.value)}
                    placeholder="Choose your State"
                />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                <FormItem className='mt-12'>
                    <FormLabel className='text-[14px] font-nunito-sans font-semibold leading-0 mb-1'>Address</FormLabel>
                    <FormControl>
                    <Input className='bg-[#F1F4FE] rounded-md placeholder:text-[#9EB4E8] focus:border-dark-blue transition-all duration-300 ease-in-out'  placeholder="Required" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                <FormItem className='mt-6'>
                    <FormLabel className='text-[14px] font-nunito-sans font-semibold leading-0 mb-1'>City</FormLabel>
                    <FormControl>
                    <Input className='bg-[#F1F4FE] rounded-md placeholder:text-[#9EB4E8] focus:border-dark-blue transition-all duration-300 ease-in-out'  placeholder="Required" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                <FormItem className='mt-6'>
                    <FormLabel className='text-[14px] font-nunito-sans font-semibold leading-0 mb-1'>Postal Code</FormLabel>
                    <FormControl>
                    <Input className='bg-[#F1F4FE] rounded-md placeholder:text-[#9EB4E8] focus:border-dark-blue transition-all duration-300 ease-in-out'  placeholder="Required" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                <FormItem className='mt-6'>
                    <FormLabel className='text-[14px] font-nunito-sans font-semibold leading-0 mb-1'>Phone Number</FormLabel>
                    <FormControl>
                    <Input className='bg-[#F1F4FE] rounded-md placeholder:text-[#9EB4E8] focus:border-dark-blue transition-all duration-300 ease-in-out'  placeholder="Optional" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <div className='fixed bottom-5 left-0 z-20 w-full px-6'>
                <PrimaryButton disabled={!hasChanges || loading} text={loading ? <LoaderCircle className='animate-spin' /> : 'Save Changes'} type="submit" additionalStyles="" />
            </div>
        </form>
        </Form>
        </section>
    </ProtectedRoute>
  )
}

export default page;