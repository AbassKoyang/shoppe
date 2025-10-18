// app/api/payment/verify-account/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const accountNumber = req.nextUrl.searchParams.get('account_number');
    const bankCode = req.nextUrl.searchParams.get('bank_code');

    if (!accountNumber || !bankCode) {
        return NextResponse.json(
            { error: 'Account number and bank code are required' },
            { status: 400 }
        );
    }

    try {
        const response = await fetch(
            `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                }
            }
        );

        const data = await response.json();

        if (!data.status) {
            return NextResponse.json(
                { error: data.message || 'Could not verify account' },
                { status: 400 }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Account verification error:', error);
        return NextResponse.json(
            { error: 'Failed to verify account' },
            { status: 500 }
        );
    }
}