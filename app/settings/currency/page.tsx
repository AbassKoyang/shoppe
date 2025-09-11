'use client';
import ProtectedRoute from "@/components/ProtectedRoute"
import { useAuth } from "@/lib/contexts/auth-context";
import { useFetchCurrency } from "@/services/users/queries";
import SelectCurrencyButton from "../components/SelectCurrencyButton";

const page = () => {
    const {user} = useAuth();
    const {data: fetchedCurrency, isError, isLoading} = useFetchCurrency(user?.uid || '');
  return (
    <ProtectedRoute>
        <section className='w-full'>
            <h4 className='text-[16px] font-medium font-raleway'>Currencies</h4>
            {isLoading && (
                <div className="w-full flex flex-col gap-5 mt-0">
                    <div className="w-full h-12 rounded-xl bg-gray-100 animate-pulse"></div>
                    <div className="w-full h-12 rounded-xl bg-gray-100 animate-pulse"></div>
                    <div className="w-full h-12 rounded-xl bg-gray-100 animate-pulse"></div>
                </div>
            )}
            {isError&& (
                <div className="mt-10 w-full h-full flex items-center justify-center">
                    <p className="">Failed to load currencies.</p>
                </div>
            )}
            {fetchedCurrency && (
                <div>
                    <SelectCurrencyButton currency="₦ NGN" isCurrentCurrency={fetchedCurrency == '₦ NGN'} />
                    <SelectCurrencyButton currency="$ USD" isCurrentCurrency={fetchedCurrency == '$ USD'} />
                    <SelectCurrencyButton currency="€ EURO" isCurrentCurrency={fetchedCurrency == '€ EURO'} />
                </div>
            )}
        </section>
    </ProtectedRoute>
  )
}

export default page