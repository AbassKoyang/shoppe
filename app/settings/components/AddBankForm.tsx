'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { QueryClient, useMutation } from '@tanstack/react-query';
import { addBank } from '@/services/payment/api';
import z from 'zod';
import { toast } from 'sonner';
import { useAuth } from '@/lib/contexts/auth-context';
import { useForm } from 'react-hook-form';
import {motion} from 'framer-motion'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import PrimaryButton from '@/components/PrimaryButton';
import { Loader2, LoaderCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

type BankType = {
    name: string;
    slug: string;
    code: string;
    longcode: string;
    gateway: string | null;
    pay_with_bank: boolean;
    active: boolean;
    is_deleted: boolean;
    country: string;
    currency: string;
    type: string;
    id: number;
    createdAt: string;
    updatedAt: string;
};

type AccountInfoType = {
    "account_number": string;
    "account_name": string;
}
const formSchema = z.object({
    accountNumber: z.string().min(0, "Account number is required").min(10, 'Invalid Account Number'),
    accountName: z.string().min(0, "Account name is required").min(2, "Account Name is too short."),
    bankCode: z.string().min(0, "Bank code is required"),
  });

type AddBankFormType = {
    open: boolean;
    closeModal: () => void;
}


const AddBankForm = ({open, closeModal} : AddBankFormType) => {
    const {user} = useAuth();
    const [banks, setBanks] = useState<BankType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [accountInfo, setAccountInfo] = useState<AccountInfoType | null>(null);
    const [verifying, setVerifying] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const queryClient = new QueryClient();

    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          accountName: '',
          accountNumber: "",
        },
    });
    const isDirty = form.formState.isDirty;
    const accountNumber = form.watch('accountNumber');
    const bankCode = form.watch('bankCode');
  

    const AddBankMutation = useMutation({
        mutationKey: ['addBank'],
        mutationFn: ({name, bankCode, accountNumber, userId, bankName } : {name: string; bankCode: string; accountNumber: string; userId: string; bankName: string;}) => addBank({name, bankCode, accountNumber, userId, bankName }),
        onSuccess: (data) => {
            toast.success('Bank account added')
            queryClient.invalidateQueries({ queryKey: ['bankDetails']});
        }
    });

    useEffect(() => {
        const fetchBanks = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`https://api.paystack.co/bank`);
                setBanks(response.data.data as BankType[]);
                setError(null);
            } catch (error) {
                console.error('Error while fetching banks:', error);
                setError('Failed to fetch banks');
            } finally {
                setLoading(false);
            }
        };
        
        fetchBanks();
    }, []);

    useEffect(() => {
        const verifyAccount = async () => {
          if (!accountNumber || !bankCode || accountNumber.length !== 10) {
            setAccountInfo(null);
            form.setValue('accountName', '');
            return;
          }
    
          try {
            setVerifying(true);
    
            const response = await axios.get(
              `/api/payments/verify-account?account_number=${accountNumber}&bank_code=${bankCode}`
            );
    
            const data = response.data;
            
            if (data.status && data.data) {
              setAccountInfo(data.data);
              form.setValue('accountName', data.data.account_name);
            } else {
              setAccountInfo(null);
              form.setValue('accountName', '');
              form.setError('accountNumber', {
                type: 'manual',
                message: 'Could not verify account',
              });
            }
          } catch (error: any) {
            console.error('Error verifying account:', error);
            setAccountInfo(null);
            form.setValue('accountName', '');
            form.setError('accountNumber', {
              type: 'manual',
              message: error.response?.data?.error || 'Failed to verify account',
            });
          } finally {
            setVerifying(false);
          }
        };

        const timeoutId = setTimeout(() => {
        verifyAccount();
      }, 800);
  
      return () => clearTimeout(timeoutId);
    }, [accountNumber, bankCode, form]);

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        handleAddBank(data);
    };


    const handleAddBank = async (data: z.infer<typeof formSchema>) => {
        const { accountName, accountNumber, bankCode} = data;
      
        try {
            setSubmitting(true);
          if (!user) {
            toast.error("You must be logged in to add a bank account.");
            return;
          }

          const bank = banks.filter((bank) => bank.code === bankCode);
          const bankName = bank[0].name;

          const bankDetails:  {name: string; bankCode: string; accountNumber: string; userId: string, bankName: string}  = {
            userId: user.uid,
            accountNumber,
            bankCode,
            bankName,
            name: accountName
          };
      
          const data = await AddBankMutation.mutateAsync(bankDetails);
          console.log(data);
          if(data){
            closeModal();
            form.reset();
            if (data.success) {
            console.log('bank details added successfully')
        }          }
        } catch (error: any) {
          console.error("❌ Error adding bank details:", error);
      
          if (error?.code === "permission-denied") {
            toast.error("You don’t have permission to add bank details.");
          } else if (error?.message?.includes("network")) {
            toast.error("Network error — check your connection and try again.");
          } else {
            toast.error("Something went wrong while saving your bank details. Please try again.");
          }
        } finally {
          setSubmitting(false);
        }
      };
    

    return (
        <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: open ? '0%' : '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`h-dvh w-[100vw] fixed top-0 left-0 bg-transparent flex flex-col justify-end`}>
                <div onClick={() => closeModal()} className='z-10 absolute top-0 left-0 w-full h-full bg-white/35 backdrop-blur-sm'></div>
                <div className='z-20 w-full bg-[#F8FAFF] rounded-t-2xl py-6'>
                    <h3 className='text-[22px] font-raleway font-bold mb-6 ml-6'>Add Bank Account</h3
                    >
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="bg-white w-full p-6"
                            >
                                <FormField
                                control={form.control}
                                name="accountNumber"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel className='text-[14px] font-nunito-sans font-semibold leading-0'>Account Number</FormLabel>
                                    <FormControl>
                                        <Input className='bg-[#F1F4FE] rounded-md placeholder:text-[#9EB4E8] focus:border-dark-blue transition-all duration-300 ease-in-out' placeholder="Enter account number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />

                                <FormField
                                control={form.control}
                                name="bankCode"
                                render={({ field }) => (
                                    <FormItem className='mt-6'>
                                    <FormLabel className='text-[14px] font-nunito-sans font-semibold leading-0'>Bank</FormLabel>
                                    <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full bg-[#F1F4FE] border stroke-0 transition-all duration-300 ease-in-out">
                                        <SelectValue placeholder={loading ? 'Loading banks...' : 'Select your bank'} />
                                        </SelectTrigger>
                                        <SelectContent className='w-full'>
                                        <SelectGroup className='w-full'>
                                            <SelectLabel>Banks</SelectLabel>
                                            {banks.map((bank) => (
                                            <SelectItem key={`${bank.code}${bank.id}`} value={bank.code}>
                                                {bank.name}
                                            </SelectItem>
                                            ))}
                                        </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />

                            

                                <FormField
                                control={form.control}
                                name="accountName"
                                render={({ field }) => (
                                    <FormItem className='mt-6'>
                                    <FormLabel className='text-[14px] font-nunito-sans font-semibold leading-0'>Account Name</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input className='bg-[#F1F4FE] rounded-md placeholder:text-[#9EB4E8] focus:border-dark-blue transition-all duration-300 ease-in-out m-0 text-dark-blue font-semibold' placeholder={ verifying ? 'Verifying account..' : 'Account name will appear here'} disabled {...field} />
                                            {verifying && (<Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-gray-400" />)}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                    <FormDescription>
                                    {accountInfo
                                        ? '✓ Account verified successfully'
                                        : 'Enter account number and select bank to verify'}
                                    </FormDescription>
                                    </FormItem>
                                )}
                                />


                                    <PrimaryButton disabled={!accountInfo || verifying || !isDirty}
        text={submitting ? <LoaderCircle className='animate-spin' /> : 'Save Changes'} type="submit" additionalStyles="w-full mt-6" />
                                </form>
                        </Form>
                </div>
            </motion.div>   
    )
}

export default AddBankForm;