import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios'

export async function GET(req: NextRequest) {
  try {
    const { accountNumber, bankCode } = await req.json();

    if (!accountNumber ||!bankCode) {
      return NextResponse.json(
        { error: 'Bank Account, and Bank Code are required' },
        { status: 400 }
      );
    }

    // Initialize transaction on Paystack
    const response = await axios.get(`https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    const data = await response.data;

    if (!data.status) {
      return NextResponse.json(
        { error: data.message || 'Failed to fetch account info' },
        { status: 400 }
      );
    }

    console.log('dataaaaaaaa', data)

    return NextResponse.json(data.data);
  } catch (error: any) {
    console.error('Add card initialization error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}