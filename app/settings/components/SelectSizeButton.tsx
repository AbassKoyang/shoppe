'use client';
import { useAuth } from "@/lib/contexts/auth-context";
import { updateSize } from "@/services/users/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { BsCheck } from "react-icons/bs";
import { toast } from 'sonner';

const SelectSizeButton = ({size, isCurrentSize} : {size: 'US'| 'UK'| 'EU'; isCurrentSize: boolean;}) => {
    const {user} = useAuth();
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    const UpdateSizeMutation = useMutation({
        mutationKey: ["updateSize"],
        mutationFn: ({ uid, size }: { uid: string; size: 'US'| 'UK'| 'EU' }) =>
          updateSize({ uid, size }),
      
        onMutate: async (newSize) => {
          await queryClient.cancelQueries({ queryKey: ["size"] });
      
          const previousSize = queryClient.getQueryData<string>(["size"]);
      
          queryClient.setQueryData(["size"], newSize.size);
      
          return { previousSize };
        },
      
        onError: (err, newSize, context) => {
          if (context?.previousSize) {
            queryClient.setQueryData(["size"], context.previousSize);
          }
        },
      
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ["size"] });
        },
        onSuccess: () => {
            toast.success('Preferred size updated successfully')
        }
      });
      
    const handleUpdateSize = async ({uid, size} : {uid: string; size: 'US'| 'UK'| 'EU'}) => {
        setLoading(true);
        try {
            await UpdateSizeMutation.mutateAsync({uid, size});
        } catch (error: any) {
            console.error("❌ Error edit payment method:", error);
      
          if (error?.code === "permission-denied") {
            toast.error("You don’t have permission to update size.");
          } else if (error?.message?.includes("network")) {
            toast.error("Network error — check your connection and try again.");
          } else {
            toast.error("Something went wrong while changing your preferred size. Please try again.");
          }
        } finally {
            setLoading(false);
        }
    }
  return (
    <button disabled={loading} onClick={() => handleUpdateSize({uid: user?.uid || '', size})} className={`cursor-pointer mt-4 w-full ${isCurrentSize ? 'bg-[#E5EBFC]' : 'bg-[#F9F9F9]'} hover:bg-[#E5EBFC] duration-200 ease-in-out transition-all rounded-xl p-4 pl-6 flex items-center justify-between disabled:opacity-70`}>
        <p className="font-nunito-sans font-semibold text-[16px] text-black">{size}</p>
        {loading ? (<LoaderCircle className="animate-spin text-dark-blue"/>) : (
            <span className={`${isCurrentSize ? 'bg-dark-blue' : 'bg-[#F8CECE]'} size-[22px] rounded-full border-2 border-white flex items-center justify-between`}>
                {isCurrentSize && (
                <BsCheck className="text-white" />)}
         </span>
        )}
    </button>
  )
}

export default SelectSizeButton;