import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(req: NextRequest) {
  try {
    const { name, account_number, bank_code, bankName, userId, currency = 'NGN' } = await req.json();

    if (!name || !account_number || !bank_code || !userId) {
      return NextResponse.json(
        { error: 'Name, account number, and bank code are required' },
        { status: 400 }
      );
    }

    const response = await axios.post('https://api.paystack.co/transferrecipient',
      {
        type: "nuban",
        name,
        account_number,
        bank_code,
        currency: "NGN",
        metadata: {
          userId,
          name,
          purpose: 'bank_verification',
        },
      },
       {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      }});

    const data = response.data.data;
    console.log('res',data);
    if(data){
        const docRef = doc(db, 'users', userId)
        await updateDoc(docRef, {
            bankDetails: {
                recipientCode: data.recipient_code,
                bankCode: bank_code,
                bankName,
                accountNumber: account_number,
                accountName: name,
                currency,
            }
        })
    }
    return NextResponse.json({
        success: true
    })
  } catch (error: any) {
    console.error('Add bank  error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}