'use client';
import { useAuth } from "@/lib/contexts/auth-context";
import { updateLanguage } from "@/services/users/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { BsCheck } from "react-icons/bs";
import { toast } from "react-toastify";
const SelectCountryButton = ({language, isCurrentLang} : {language: 'English' | 'Français'; isCurrentLang: boolean;}) => {
    const {user} = useAuth();
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    const updateLanguageMutation = useMutation({
        mutationKey: ["updateLanguage"],
        mutationFn: ({ uid, language }: { uid: string; language: "English" | "Français" }) =>
          updateLanguage({ uid, language }),
      
        onMutate: async (newLanguage) => {
          await queryClient.cancelQueries({ queryKey: ["language"] });
      
          const previousLanguage = queryClient.getQueryData<string>(["language"]);
      
          queryClient.setQueryData(["language"], newLanguage.language);
      
          return { previousLanguage };
        },
      
        onError: (err, newLanguage, context) => {
          if (context?.previousLanguage) {
            queryClient.setQueryData(["language"], context.previousLanguage);
          }
        },
      
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ["language"] });
        },
        onSuccess: () => {
            toast.success('Preferred langauge updated successfully')
        }
      });
      
    const handleUpdateLanguage = async ({uid, language} : {uid: string; language: 'English' | 'Français'}) => {
        setLoading(true);
        try {
            await updateLanguageMutation.mutateAsync({uid, language});
        } catch (error: any) {
            console.error("❌ Error edit payment method:", error);
      
          if (error?.code === "permission-denied") {
            toast.error("You don’t have permission to update language.");
          } else if (error?.message?.includes("network")) {
            toast.error("Network error — check your connection and try again.");
          } else {
            toast.error("Something went wrong while changing your language. Please try again.");
          }
        } finally {
            setLoading(false);
        }
    }
  return (
    <button disabled={loading} onClick={() => handleUpdateLanguage({uid: user?.uid || '', language})} className={`cursor-pointer mt-4 w-full ${isCurrentLang ? 'bg-[#E5EBFC]' : 'bg-[#F9F9F9]'} hover:bg-[#E5EBFC] duration-200 ease-in-out transition-all rounded-xl p-4 pl-6 flex items-center justify-between disabled:opacity-70`}>
        <p className="font-nunito-sans font-semibold text-[16px] text-black">{language}</p>
        {loading? (
          <LoaderCircle className="animate-spin text-dark-blue" />
        ) : (
          <span className={`${isCurrentLang ? 'bg-dark-blue' : 'bg-[#F8CECE]'} size-[22px] rounded-full border-2 border-white flex items-center justify-between`}>
            {isCurrentLang && (
            <BsCheck className="text-white" />)}
          </span>
        )}
    </button>
  )
}

export default SelectCountryButton