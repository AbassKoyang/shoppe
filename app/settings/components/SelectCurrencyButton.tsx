'use client';
import { useAuth } from "@/lib/contexts/auth-context";
import { updateCurrency, updateLanguage } from "@/services/users/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { BsCheck } from "react-icons/bs";
import { toast } from "react-toastify";

const selectCurrencyButton = ({currency, isCurrentCurrency} : {currency: '$ USD' | '€ EURO' | '₦ NGN'; isCurrentCurrency: boolean;}) => {
    const {user} = useAuth();
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    const updateCurrencyMutation = useMutation({
        mutationKey: ["updateLanguage"],
        mutationFn: ({ uid, currency }: { uid: string; currency: '$ USD' | '€ EURO' | '₦ NGN' }) =>
          updateCurrency({ uid, currency}),
      
        onMutate: async (newCurrency) => {
          await queryClient.cancelQueries({ queryKey: ["currency"] });
      
          const previousCurrency = queryClient.getQueryData<string>(["currency"]);
      
          queryClient.setQueryData(["currency"], newCurrency.currency);
      
          return { previousCurrency };
        },
      
        onError: (err, newCurrency, context) => {
          if (context?.previousCurrency) {
            queryClient.setQueryData(["currency"], context.previousCurrency);
          }
        },
      
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ["currency"] });
        },
        onSuccess: () => {
            toast.success('Preferred currency updated successfully')
        }
      });
      
    const handleUpdateLanguage = async ({uid, currency} : {uid: string; currency: '$ USD' | '€ EURO' | '₦ NGN'}) => {
        setLoading(true);
        try {
            await updateCurrencyMutation.mutateAsync({uid, currency});
        } catch (error: any) {
            console.error("❌ Error updating currency", error);
      
          if (error?.code === "permission-denied") {
            toast.error("You don’t have permission to update currency.");
          } else if (error?.message?.includes("network")) {
            toast.error("Network error — check your connection and try again.");
          } else {
            toast.error("Something went wrong while changing your currency. Please try again.");
          }
        } finally {
            setLoading(false);
        }
    }
  return (
    <button disabled={loading} onClick={() => handleUpdateLanguage({uid: user?.uid || '', currency})} className={`cursor-pointer mt-4 w-full ${isCurrentCurrency ? 'bg-[#E5EBFC]' : 'bg-[#F9F9F9]'} hover:bg-[#E5EBFC] duration-200 ease-in-out transition-all rounded-xl p-4 pl-6 flex items-center justify-between disabled:opacity-70`}>
        <p className="font-nunito-sans font-semibold text-[16px] text-black">{currency}</p>
        {loading? (
          <LoaderCircle className="animate-spin text-dark-blue" />
        ) : (
          <span className={`${isCurrentCurrency ? 'bg-dark-blue' : 'bg-[#F8CECE]'} size-[22px] rounded-full border-2 border-white flex items-center justify-between`}>
            {isCurrentCurrency && (
            <BsCheck className="text-white" />)}
          </span>
        )}
    </button>
  )
}

export default selectCurrencyButton;