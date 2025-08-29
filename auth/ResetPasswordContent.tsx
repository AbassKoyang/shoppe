"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "@/lib/firebase"; // your firebase config
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import { defaultProfileAvatar, eyeIcon, resetPasswordBubble } from "@/public/assets/images/exports";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';

export default function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const oobCode = searchParams.get("oobCode"); // reset token
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const formSchema = z.object({
    password: z.string().min(1, {error: 'Password is required.'}).min(4, 'Password must be at least 4 characters.').max(6, 'Password cannot exceed 6 characters.'),
    confirmPassword: z.string().min(1, {error: 'Password is required.'}).min(4, 'Password must be at least 4 characters.').max(6, 'Password cannot exceed 6 characters.'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
});;
const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        password: '',
        confirmPassword: ''
    },
});

  const handleReset = async (data: z.infer<typeof formSchema>) => {
    if (!oobCode) {
      toast.error("Invalid or missing reset code.");
      return;
    }

    if (!data.password || !data.confirmPassword) {
      toast.error("Please fill in both password fields.");
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await verifyPasswordResetCode(auth, oobCode);

      await confirmPasswordReset(auth, oobCode, data.password);

      toast.success("✅ Password has been reset! You can now log in.");
      router.push("/auth/login");

    } catch (err: any) {
      console.error("Password reset error:", err);

      switch (err.code) {
        case "auth/expired-action-code":
          toast.error("This reset link has expired. Please request a new one.");
          break;

        case "auth/invalid-action-code":
          toast.error("Invalid or already used reset link.");
          break;

        case "auth/weak-password":
          toast.error("Password is too weak. Please use at least 6 characters.");
          break;

        case "auth/network-request-failed":
          toast.error("Network error. Please check your connection and try again.");
          break;

        default:
          toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    handleReset(data);
}

  return (
    <section className={`relative w-[100vw] min-h-dvh flex flex-col items-center bg-white pb-4`}>
        <Image width={400} height={380} src={resetPasswordBubble} alt='bubble' className='absolute top-0 right-0' />
        <div className='w-full min-h-dvh px-6 flex flex-col items-center justify-between z-50'>
            <div className='mb-8 flex flex-col items-center justify-center mt-36'>
            <Image width={120} src={defaultProfileAvatar} alt='Profile picture' className='border-white border-8 rounded-full' />
            <h1 className='text-[#202020] text-[25px] font-bold leading-[1.1] mt-5'>Setup New Password</h1>
            <p className='font-light text-xl text-black mt-4 mb-6 text-center'>Please, setup a new password for your account.</p>
            </div>

            <div>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=''>
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
                <button type='submit' className={`mt-8 w-full cursor-pointer bg-dark-blue hover:opacity-90 transition-all duration-200 ease-in-out text-[#F3F3F3] text-[22px] font-extralight flex items-center justify-center rounded-xl px-18 py-3`}>
                {loading ? <LoaderCircle className='animate-spin' /> : 'Reset'}
                </button>
                </form>
                </Form>

                <div className='w-full flex items-center justify-center my-3'>
                        <button type='button' onClick={() => {router.push('/auth')}} className='text-[#202020] text-[15px] font-light cursor-pointer'>Cancel</button>
                </div>
        </div>
      </div>
    </section>
  );
}
