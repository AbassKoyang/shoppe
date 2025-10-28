'use client';
import ProtectedRoute from "@/components/ProtectedRoute"
import { useAuth } from "@/lib/contexts/auth-context";
import { useFetchCountry } from "@/services/users/queries";
import { states } from "@/lib/utils";
import SelectCountryButton from "../components/SelectCountryButton";
import { useState } from "react";

const page = () => {
    const {user} = useAuth();
    const {data: fetchedCountry, isError, isLoading} = useFetchCountry(user?.uid || '');
    const [query, setQuery] = useState('');
  return (
    <ProtectedRoute>
        <section className='w-full'>
            <h4 className='text-[16px] font-medium font-raleway'>States</h4>
            <input onChange={(e) => setQuery(e.target.value)} type="text" placeholder="Search.." className="w-full bg-gray-100 rounded-xl px-3 py-2 h-12 border-1 border-gray-300 focus:border-dark-blue mt-4" />
            {isLoading && (
                <div className="w-full flex flex-col gap-5 mt-5">
                    <div className="w-full h-12 rounded-xl bg-gray-100 animate-pulse"></div>
                    <div className="w-full h-12 rounded-xl bg-gray-100 animate-pulse"></div>
                    <div className="w-full h-12 rounded-xl bg-gray-100 animate-pulse"></div>
                </div>
            )}
            {isError&& (
                <div className="mt-10 w-full h-full flex items-center justify-center">
                    <p className="">Failed to load states.</p>
                </div>
            )}
            {fetchedCountry && query == '' && (
                states.map((state) => (
                    <SelectCountryButton country={state.label} isCurrentCountry={fetchedCountry == state.label} />
            ))
            )}
            {fetchedCountry && query !== '' && (
                states.filter((s) => s.label.toLowerCase().includes(query.toLowerCase())).map((state) => (
                    <SelectCountryButton country={state.label} isCurrentCountry={fetchedCountry == state.label} />
            )) )}
        </section>
    </ProtectedRoute>
  )
}

export default page