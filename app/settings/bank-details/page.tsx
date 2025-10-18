'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios'

type BankType = {
    name: string;
    slug: string;
    code: string;
    longcode: string;
    gateway: string | null;
    pay_with_bank: boolean;
    active: boolean;
    is_deleted: boolean;
    country: string;
    currency: string;
    type: string;
    id: number;
    createdAt: string;
    updatedAt: string;
};

type AccountInfoType = {
    "account_number": string;
    "account_name": string;
}

const Page = () => {
    const [accountNumber, setAccountNumber] = useState('');
    const [bankCode, setBankCode] = useState('');
    const [banks, setBanks] = useState<BankType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [accountInfo, setAccountInfo] = useState<AccountInfoType | null>(null);
    const [verifying, setVerifying] = useState(false);

    // Fetch banks on mount
    useEffect(() => {
        const fetchBanks = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`https://api.paystack.co/bank`);
                setBanks(response.data.data as BankType[]);
                setError(null);
            } catch (error) {
                console.error('Error while fetching banks:', error);
                setError('Failed to fetch banks');
            } finally {
                setLoading(false);
            }
        };
        
        fetchBanks();
    }, []); // Only run once on mount

    // Verify account when both accountNumber and bankCode are available
    useEffect(() => {
        const getAccountInfo = async () => {
            // Only proceed if both values are set and account number is 10 digits
            if (!accountNumber || !bankCode || accountNumber.length !== 10) {
                setAccountInfo(null);
                return;
            }

            try {
                setVerifying(true);
                console.log('Verifying:', accountNumber, bankCode);

                // Call your API route instead of Paystack directly
                const response = await axios.get(
                    `/api/payments/verify-account?account_number=${accountNumber}&bank_code=${bankCode}`
                );

                const data = response.data;
                console.log('Account info:', data);
                setAccountInfo(data.data);
            } catch (error) {
                console.error('Error verifying account:', error);
                setAccountInfo(null);
            } finally {
                setVerifying(false);
            }
        };

        // Debounce the API call
        const timeoutId = setTimeout(() => {
            getAccountInfo();
        }, 500); // Wait 500ms after user stops typing

        return () => clearTimeout(timeoutId);
    }, [accountNumber, bankCode]); // Run when either changes

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting:', { accountNumber, bankCode, accountInfo });
        // Your submit logic here
    };

    return (
        <div className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input 
                        onChange={(e) => setAccountNumber(e.target.value)} 
                        placeholder='Account Number' 
                        value={accountNumber} 
                        type="text" 
                        maxLength={10}
                        className="border p-2 rounded w-full"
                    />
                </div>

                <div>
                    {loading ? (
                        <p>Loading banks...</p>
                    ) : banks.length > 0 ? (
                        <select 
                            onChange={(e) => setBankCode(e.target.value)} // ✅ Use onChange, not onSelect
                            value={bankCode}
                            className="border p-2 rounded w-full"
                        >
                            <option value="">Select bank</option>
                            {banks.map((bank) => (
                                <option key={bank.id} value={bank.code}>
                                    {bank.name}
                                </option>
                            ))}
                        </select>
                    ) : null}
                </div>

                <div>
                    <input 
                        placeholder={verifying ? 'Verifying...' : 'Account Name'} 
                        disabled 
                        value={accountInfo?.account_name || ''} 
                        className="border p-2 rounded w-full bg-gray-100"
                    />
                </div>

                {error && <p className="text-red-600">{error}</p>}

                <button 
                    type="submit" 
                    disabled={!accountInfo || verifying}
                    className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

export default Page;