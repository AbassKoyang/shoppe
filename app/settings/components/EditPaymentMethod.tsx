'use client';
import React, { useEffect, useState } from 'react';
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
import { addPaymentMethod, deletePaymentMethodById, updatePaymentMethod } from '@/services/users/api';
import { paymentMethodType } from '@/services/users/types';
import { toast } from 'react-toastify';
import { useAuth } from '@/lib/contexts/auth-context';
import {LoaderCircle, Trash2 } from 'lucide-react';
import {motion} from 'framer-motion';

const formSchema = z.object({
    cardNumber: z
      .string()
      .min(12, "Card number too short")
      .refine((val) => valid.number(val).isValid, {
        message: "Invalid card number.",
      }),
    expiry: z
      .string()
      .refine((val) => valid.expirationDate(val).isValid, {
        message: "Invalid expiry date (MM/YY).",
      }),
    cvv: z
      .string()
      .refine((val) => valid.cvv(val).isValid, {
        message: "Invalid CVV.",
      }),
    cardHolder: z.string().min(0, "Card holder name is required").min(2, "Card holder name is  too short."),
  });

type EditPaymentMethodFormType = {
    paymentMethod: paymentMethodType;
    open: boolean;
    closeModal: () => void;
}

const EditPaymentMethodForm = ({paymentMethod, open, closeModal} : EditPaymentMethodFormType) => {
    const {user} = useAuth();
    const [loading, setloading] = useState(false);
    const [deleteLoading, setDeleteloading] = useState(false);
    const queryClient = useQueryClient();

        const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          cardNumber: `**** **** **** ${paymentMethod?.last4}`,
          expiry: paymentMethod?.expiryDate,
          cvv: paymentMethod?.cvv,
          cardHolder: paymentMethod?.cardHolder,
        },
        });
        useEffect(() => {
            if (paymentMethod) {
                form.reset({
                    cardNumber: `**** **** **** ${paymentMethod?.last4}`,
                    expiry: paymentMethod?.expiryDate,
                    cvv: paymentMethod?.cvv,
                    cardHolder: paymentMethod?.cardHolder,
                });
            }
        }, [paymentMethod, form]);

        const deletePaymentMethodMutation = useMutation({
            mutationKey: ['deletePaymentMethod'],
            mutationFn: (id : string) => deletePaymentMethodById(id),
            onSuccess: (data) => {
                toast.success(`Card deleted succesfully.`);
                queryClient.invalidateQueries({ queryKey: ['paymentMethods']});
            }
        });
        const EditPaymentMethodMutation = useMutation({
            mutationKey: ['updatePaymentMethod'],
            mutationFn: (data : paymentMethodType) => updatePaymentMethod(data),
            onSuccess: (data) => {
                toast.success(`Card updated succesfully.`);
                queryClient.invalidateQueries({ queryKey: ['paymentMethods']});
            }
        });
    
        const watchedValues = form.watch();    
      
        const originalValues  = {
          cardHolder: paymentMethod.cardHolder || '',
          cvv: paymentMethod.cvv || '',
          expiryDate: paymentMethod.expiryDate || '',
          last4: `**** **** **** ${paymentMethod?.last4}` || '',
        };
  
      const hasChanges = watchedValues.cardHolder !== originalValues.cardHolder || 
                        watchedValues.cardNumber !== originalValues.last4 ||
                        watchedValues.expiry !== originalValues.expiryDate ||
                        watchedValues.cvv !== originalValues.cvv
                        ;

      const onSubmit = (data: z.infer<typeof formSchema>) => {
        handleEditPaymentMethod(data);
      };

      const handleDeletePaymentMethod = async (id: string) => {
        try {
            setDeleteloading(true);
            await deletePaymentMethodMutation.mutateAsync(id);
            closeModal();
            form.reset();
        } catch (error: any) {
            console.error("❌ Error deleting payment method:", error);
      
          if (error?.code === "permission-denied") {
            toast.error("You don’t have permission to delete this card.");
          } else if (error?.message?.includes("network")) {
            toast.error("Network error — check your connection and try again.");
          } else {
            toast.error("Something went wrong while deleting your card. Please try again.");
          }
        }finally {
            setDeleteloading(false);
        };
      };

      const handleEditPaymentMethod = async (data: z.infer<typeof formSchema>) => {
        const numberValidation = valid.number(data.cardNumber);
        const brand = numberValidation.card?.niceType || "Unknown";
        const { cardHolder, cardNumber, expiry, cvv } = data;
      
        try {
            setloading(true);
          if (!user) {
            toast.error("You must be logged in to update a payment method.");
            return;
          }
      
          const cardDetails: paymentMethodType = {
            id: paymentMethod.id,
            userId: paymentMethod.userId,
            cardHolder,
            brand,
            last4: cardNumber.slice(-4),
            expiryDate: expiry,
            cvv,
            token: "",
          };
      
          const success = await EditPaymentMethodMutation.mutateAsync(cardDetails);
          if(success){
            closeModal();
            form.reset();
          }
        } catch (error: any) {
          console.error("❌ Error edit payment method:", error);
      
          if (error?.code === "permission-denied") {
            toast.error("You don’t have permission to edit this card.");
          } else if (error?.message?.includes("network")) {
            toast.error("Network error — check your connection and try again.");
          } else {
            toast.error("Something went wrong while editing your card. Please try again.");
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
            <div className='mb-6 px-6 flex items-center justify-between'>
                <h3 className='text-[22px] font-raleway font-bold'>Edit Card</h3>
                 <button
                 onClick={() => handleDeletePaymentMethod(paymentMethod.id || '')}
                 className='cursor-pointer size-[35px] flex items-center justify-center rounded-full'
                 ><Trash2 className='text-red-300 text-[14px]' /></button>
            </div>
                {paymentMethod && (
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
                        name="cardNumber"
                        render={({ field }) => (
                            <FormItem className='mt-6'>
                            <FormLabel className='text-[14px] font-nunito-sans font-semibold leading-0'>Card Number</FormLabel>
                            <FormControl>
                                <Input className='bg-[#F1F4FE] rounded-md placeholder:text-[#9EB4E8] focus:border-dark-blue transition-all duration-300 ease-in-out m-0' placeholder="4111 1111 1111 1111" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                        <div className="flex justify-between gap-4 mt-6">
                            <FormField
                                control={form.control}
                                name="expiry"
                                render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel className='text-[14px] font-nunito-sans font-semibold leading-0'>Expiry (MM/YY)</FormLabel>
                                    <FormControl>
                                    <Input className='bg-[#F1F4FE] rounded-md placeholder:text-[#9EB4E8] focus:border-dark-blue transition-all duration-300 ease-in-out'  placeholder="12/25" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="cvv"
                                render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel className='text-[14px] font-nunito-sans font-semibold leading-0'>CVV</FormLabel>
                                    <FormControl>
                                    <Input className='bg-[#F1F4FE] rounded-md placeholder:text-[#9EB4E8] focus:border-dark-blue transition-all duration-300 ease-in-out'  placeholder="123" type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            </div>

                            <PrimaryButton disabled={loading || deleteLoading || !hasChanges} text={loading ? <LoaderCircle className='animate-spin' /> : 'Save Changes'} type="submit" additionalStyles="w-full mt-6" />
                        </form>
                </Form>)}
        </div>
    </motion.div>
  )
}

export default EditPaymentMethodForm