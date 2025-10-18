import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, name, userId } = await req.json();

    if (!email || !name || !userId) {
      return NextResponse.json(
        { error: 'Email, name, and userId are required' },
        { status: 400 }
      );
    }

    // Initialize transaction on Paystack
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: 5000, // 50 Naira in kobo (50 * 100)
        channels: ['card'],
        metadata: {
          userId,
          name,
          purpose: 'card_verification',
        },
        callback_url:process.env.NEXT_PUBLIC_APP_URL 
        ? `${process.env.NEXT_PUBLIC_APP_URL}/settings/payment-methods`
        : 'http://localhost:3000/settings/payment-methods',
      }),
    });

    const data = await response.json();

    if (!data.status) {
      return NextResponse.json(
        { error: data.message || 'Failed to initialize transaction' },
        { status: 400 }
      );
    }

    console.log('dataaaaaaaa', data)

    return NextResponse.json({
      authorization_url: data.data.authorization_url,
      access_code: data.data.access_code,
      reference: data.data.reference,
    });
  } catch (error: any) {
    console.error('Add card initialization error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}