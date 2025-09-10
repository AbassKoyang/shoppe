'use client';
import ProtectedRoute from "@/components/ProtectedRoute"
import { useAuth } from "@/lib/contexts/auth-context";
import { useFetchSize } from "@/services/users/queries";
import SelectSizeButton from "../components/SelectSizeButton";

const page = () => {
    const {user} = useAuth();
    const {data: fetchedSize, isError, isLoading} = useFetchSize(user?.uid || '');
  return (
    <ProtectedRoute>
        <section className='w-full'>
            <h4 className='text-[16px] font-medium font-raleway'>Sizes</h4>
            {isLoading && (
                <div className="w-full flex flex-col gap-5 mt-0">
                    <div className="w-full h-12 rounded-xl bg-gray-100 animate-pulse"></div>
                    <div className="w-full h-12 rounded-xl bg-gray-100 animate-pulse"></div>
                    <div className="w-full h-12 rounded-xl bg-gray-100 animate-pulse"></div>
                </div>
            )}
            {isError&& (
                <div className="mt-10 w-full h-full flex items-center justify-center">
                    <p className="">Failed to load sizes.</p>
                </div>
            )}
            {fetchedSize && (
                <div>
                    <SelectSizeButton size="US" isCurrentSize={fetchedSize == 'US'} />
                    <SelectSizeButton size="EU" isCurrentSize={fetchedSize == 'EU'} />
                    <SelectSizeButton size="UK" isCurrentSize={fetchedSize == 'UK'} />
                </div>
            )}
        </section>
    </ProtectedRoute>
  )
}

export default page