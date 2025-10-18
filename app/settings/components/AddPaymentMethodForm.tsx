'use client';
import React, { useState } from 'react';
import {
    Form,
    FormControl,
    FormLabel,
    FormDescription,
    FormMessage,
    FormItem,
    FormField
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import valid from "card-validator";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PrimaryButton from '@/components/PrimaryButton';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useAuth } from '@/lib/contexts/auth-context';
import { LoaderCircle } from 'lucide-react';
import {motion} from 'framer-motion';
import { paymentMethodType } from '@/services/payment/types';
import { addPaymentMethod } from '@/services/payment/api';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
    email: z.email().min(0, "Email address is required"),
    cardHolder: z.string().min(0, "Card holder name is required").min(2, "Card holder name is  too short."),
  });

type AddPaymentMethodFormType = {
    open: boolean;
    closeModal: () => void;
}

const AddPaymentMethodForm = ({open, closeModal} : AddPaymentMethodFormType) => {
    const {user} = useAuth();
    const [loading, setloading] = useState(false);
    const queryClient = useQueryClient();
    const router = useRouter();

        const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: '',
          cardHolder: "",
        },
        });

      const isDirty = form.formState.isDirty;

        const AddPaymentMethodMutation = useMutation({
            mutationKey: ['addPaymentMethod'],
            mutationFn: ({cardHolder, email, userId} : {cardHolder: string; email: string; userId: string;}) => addPaymentMethod({userId, cardHolder, email}),
            onSuccess: (data) => {
                toast.success(`Card saved succesfully.`);
                queryClient.invalidateQueries({ queryKey: ['paymentMethods']});
            }
        });

      const onSubmit = (data: z.infer<typeof formSchema>) => {
        handleAddPaymentMethod(data);
      };

      const handleAddPaymentMethod = async (data: z.infer<typeof formSchema>) => {
        const { cardHolder, email} = data;
      
        try {
            setloading(true);
          if (!user) {
            toast.error("You must be logged in to add a payment method.");
            return;
          }
      
          const cardDetails:  {cardHolder: string; email: string; userId: string;} = {
            userId: user.uid,
            cardHolder,
            email
          };
      
          const data = await AddPaymentMethodMutation.mutateAsync(cardDetails);
          if(data){
            closeModal();
            form.reset();
            if (data.authorization_url) {
              window.location.href = data.authorization_url;
            } else {
              console.log('No url, couldnt route')
            }          }
        } catch (error: any) {
          console.error("❌ Error adding payment method:", error);
      
          if (error?.code === "permission-denied") {
            toast.error("You don’t have permission to add this card.");
          } else if (error?.message?.includes("network")) {
            toast.error("Network error — check your connection and try again.");
          } else {
            toast.error("Something went wrong while saving your card. Please try again.");
          }
        } finally {
          setloading(false);
        }
      };
      
  return (
    <motion.div 
    initial={{ y: '0%' }}
    animate={{ y: open ? '0%' : '100%' }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
    className={`h-dvh w-[100vw] fixed top-0 left-0 bg-transparent flex flex-col justify-end`}>
        <div onClick={() => closeModal()} className='z-10 absolute top-0 left-0 w-full h-full bg-[#E9E9E9] opacity-75'></div>
        <div className='z-20 w-full bg-[#F8FAFF] rounded-t-2xl py-6'>
            <h3 className='text-[22px] font-raleway font-bold mb-6 ml-6'>Add Card</h3
            >
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="bg-white w-full p-6"
                    >
                        <FormField
                        control={form.control}
                        name="cardHolder"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel className='text-[14px] font-nunito-sans font-semibold leading-0'>Card Holder</FormLabel>
                            <FormControl>
                                <Input className='bg-[#F1F4FE] rounded-md placeholder:text-[#9EB4E8] focus:border-dark-blue transition-all duration-300 ease-in-out' placeholder="Amanda Morgan" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                        <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className='mt-6'>
                            <FormLabel className='text-[14px] font-nunito-sans font-semibold leading-0'>Email</FormLabel>
                            <FormControl>
                                <Input className='bg-[#F1F4FE] rounded-md placeholder:text-[#9EB4E8] focus:border-dark-blue transition-all duration-300 ease-in-out m-0' placeholder="amandamorgan@gmail.com" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                            <PrimaryButton disabled={loading || !isDirty} text={loading ? <LoaderCircle className='animate-spin' /> : 'Save Changes'} type="submit" additionalStyles="w-full mt-6" />
                        </form>
                </Form>
        </div>
    </motion.div>
  )
}

export default AddPaymentMethodForm