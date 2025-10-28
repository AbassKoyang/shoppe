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
import { addPaymentMethod, deletePaymentMethodById, updatePaymentMethod } from '@/services/payment/api';
import { paymentMethodType } from '@/services/payment/types';
import { toast } from 'sonner';
import { useAuth } from '@/lib/contexts/auth-context';
import {LoaderCircle, Trash2 } from 'lucide-react';
import {motion} from 'framer-motion';
import ConfirmDelete from './ConfirmDelete';

const formSchema = z.object({
    email: z.email().min(0, "Email address is required"),
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
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const queryClient = useQueryClient();

        const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: paymentMethod.email,
          cardHolder: paymentMethod?.cardHolder,
        },
        });
        useEffect(() => {
            if (paymentMethod) {
                form.reset({
                    email: paymentMethod?.email,
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
            mutationFn: ({id, email, cardHolder} : {cardHolder: string; email: string; id: string;}) => updatePaymentMethod({id, email, cardHolder}),
            onSuccess: (data) => {
                queryClient.invalidateQueries({ queryKey: ['paymentMethods']});
            }
        });
    
        const isDirty = form.formState.isDirty;

      const onSubmit = (data: z.infer<typeof formSchema>) => {
        handleEditPaymentMethod(data, paymentMethod.id || '');
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

      const handleEditPaymentMethod = async (data: z.infer<typeof formSchema>, id: string) => {
        const { cardHolder, email } = data;
      
        try {
            setloading(true);
          if (!user) {
            toast.error("You must be logged in to update a payment method.");
            return;
          }
      
          const cardDetails:  {cardHolder: string; email: string; id: string;} = {
            id,
            cardHolder,
            email
          };
      
          const data = await EditPaymentMethodMutation.mutateAsync(cardDetails);
          if(data){
            closeModal();
            form.reset();
            setIsConfirmModalOpen(false);
            if (data.authorization_url) {
              window.location.href = data.authorization_url;
            } else {
              console.log('No url, couldnt route')
            } 
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
    initial={{ y: '100%' }}
    animate={{ y: open ? '0%' : '100%' }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
    className={`h-dvh w-[100vw] fixed top-0 left-0 bg-transparent flex flex-col justify-end z-200`}>
        <div onClick={() => closeModal()} className='z-10 absolute top-0 left-0 w-full h-full bg-white/35 backdrop-blur-sm'></div>

        <div className='z-20 w-full bg-[#F8FAFF] rounded-t-2xl py-6'>
            <div className='mb-6 px-6 flex items-center justify-between'>
                <h3 className='text-[22px] font-raleway font-bold'>Edit Card</h3>
                 <button
                 onClick={() =>{
                    setIsConfirmModalOpen(true);
                 }}
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
                        name="email"
                        render={({ field }) => (
                            <FormItem className='mt-6'>
                            <FormLabel className='text-[14px] font-nunito-sans font-semibold leading-0'>Email</FormLabel>
                            <FormControl>
                                <Input className='bg-[#F1F4FE] rounded-md placeholder:text-[#9EB4E8] focus:border-dark-blue transition-all duration-300 ease-in-out m-0' placeholder="4111 1111 1111 1111" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                        <span className='mt-2 font-nunito-sans text-gray-500 text-[14px]'>You will be redirected to a Paystack checkout page to fill in your card details. An activation fee of N50 will be deducted (and later refunded).</span>

                            <PrimaryButton disabled={loading || deleteLoading || !isDirty} text={loading ? <LoaderCircle className='animate-spin' /> : 'Save Changes'} type="submit" additionalStyles="w-full mt-6" />
                        </form>
                </Form>)}
        </div>
        <ConfirmDelete isDeleting={deleteLoading} open={isConfirmModalOpen} deletePaymentMethod={() => handleDeletePaymentMethod(paymentMethod.id || '')} closeModal={() => setIsConfirmModalOpen(false)} />
    </motion.div>
  )
}

export default EditPaymentMethodForm