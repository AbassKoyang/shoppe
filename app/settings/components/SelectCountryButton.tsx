'use client';
import { useAuth } from "@/lib/contexts/auth-context";
import { updateCountry } from "@/services/users/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { BsCheck } from "react-icons/bs";
import { toast } from "react-toastify";

const SelectCountryButton = ({country, isCurrentCountry} : {country: string; isCurrentCountry: boolean;}) => {
    const {user} = useAuth();
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    const updateCountryMutation = useMutation({
        mutationKey: ["updateCountry"],
        mutationFn: ({ uid, country }: { uid: string; country: string }) =>
          updateCountry({ uid, country }),
      
        onMutate: async (newCountry) => {
          await queryClient.cancelQueries({ queryKey: ["country"] });
      
          const previousCountry = queryClient.getQueryData<string>(["country"]);
      
          queryClient.setQueryData(["country"], newCountry.country);
      
          return { previousCountry };
        },
      
        onError: (err, newCountry, context) => {
          if (context?.previousCountry) {
            queryClient.setQueryData(["country"], context.previousCountry);
          }
        },
      
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ["country"] });
        },
        onSuccess: () => {
            toast.success('Preferred country updated successfully')
        }
      });
      
    const handleUpdateCountry = async ({uid, country} : {uid: string; country: string}) => {
        setLoading(true);
        try {
            await updateCountryMutation.mutateAsync({uid, country});
        } catch (error: any) {
            console.error("❌ Error updating state:", error);
      
          if (error?.code === "permission-denied") {
            toast.error("You don’t have permission to update state.");
          } else if (error?.message?.includes("network")) {
            toast.error("Network error — check your connection and try again.");
          } else {
            toast.error("Something went wrong while changing your state. Please try again.");
          }
        } finally {
            setLoading(false);
        }
    }
  return (
    <button disabled={loading} onClick={() => handleUpdateCountry({uid: user?.uid || '', country})} className={`cursor-pointer mt-4 w-full ${isCurrentCountry ? 'bg-[#E5EBFC]' : 'bg-[#F9F9F9]'} hover:bg-[#E5EBFC] duration-200 ease-in-out transition-all rounded-xl p-4 pl-6 flex items-center justify-between disabled:opacity-70`}>
        <p className="font-nunito-sans font-semibold text-[16px] text-black">{country}</p>
        {loading? (
          <LoaderCircle className="animate-spin text-dark-blue" />
        ) : (
          <span className={`${isCurrentCountry ? 'bg-dark-blue' : 'bg-[#F8CECE]'} size-[22px] rounded-full border-2 border-white flex items-center justify-between`}>
            {isCurrentCountry && (
            <BsCheck className="text-white" />)}
          </span>
        )}
    </button>
  )
}

export default SelectCountryButton;