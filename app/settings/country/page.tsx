'use client';
import ProtectedRoute from "@/components/ProtectedRoute"
import { useAuth } from "@/lib/contexts/auth-context";
import { useFetchCountry } from "@/services/users/queries";
import { countries } from "@/lib/utils";
import SelectCountryButton from "../components/SelectCountryButton";
import { useState } from "react";

const page = () => {
    const {user} = useAuth();
    const {data: fetchedCountry, isError, isLoading} = useFetchCountry(user?.uid || '');
    const [query, setQuery] = useState('');
  return (
    <ProtectedRoute>
        <section className='w-full'>
            <h4 className='text-[16px] font-medium font-raleway'>Countries</h4>
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
                    <p className="">Failed to load sizes.</p>
                </div>
            )}
            {fetchedCountry && query == '' && (
                countries.map((country) => (
                    <SelectCountryButton country={country.label} isCurrentCountry={fetchedCountry == country.label} />
            ))
            )}
            {fetchedCountry && query !== '' && (
                countries.filter((c) => c.label.toLowerCase().includes(query.toLowerCase())).map((country) => (
                    <SelectCountryButton country={country.label} isCurrentCountry={fetchedCountry == country.label} />
            )) )}
        </section>
    </ProtectedRoute>
  )
}

export default page