'use client';
import ProtectedRoute from "@/components/ProtectedRoute"
import { useAuth } from "@/lib/contexts/auth-context";
import { useFetchLanguage } from "@/services/users/queries";
import SelectCountryButton from "../components/SelectCountryButton";

const page = () => {
    const {user} = useAuth();
    const {data: fethcedLanguage, isError, isLoading} = useFetchLanguage(user?.uid || '');
  return (
    <ProtectedRoute>
        <section className='w-full'>
            <h4 className='text-[16px] font-medium font-raleway'>Language</h4>
            {isLoading && (
                <p className="mt-10">Loading...</p>
            )}
            {isError&& (
                <p className="mt-10">Failed to load language...</p>
            )}
            {fethcedLanguage && (
                <div>
                    <SelectCountryButton language="English" isCurrentLang={fethcedLanguage == 'English'} />
                    <SelectCountryButton language="Français" isCurrentLang={fethcedLanguage == 'Français'} />
                </div>
            )}
        </section>
    </ProtectedRoute>
  )
}

export default page