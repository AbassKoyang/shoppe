// 4. WEBHOOK ROUTE (app/api/payment/webhooks/add-card/route.ts)
// ============================================
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { headers } from 'next/headers';
import { db } from '@/lib/firebase'; // Import your Firebase config
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { paymentMethodType } from '@/services/payment/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const hash = crypto
      .createHmac('sha512', process.env.NEXT_PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest('hex');

    const signature = (await headers()).get('x-paystack-signature');

    if (hash !== signature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);

    if (event.event === 'charge.success') {
      const { data } = event;

      if (data.metadata?.purpose === 'card_verification') {
        const { userId, name } = data.metadata;
        const { authorization, customer } = data;

        const cardData: paymentMethodType = {
          userId,
          cardHolder: name,
          brand: authorization.brand,
          last4: authorization.last4,
          expiryMonth: authorization.exp_month,
          expiryYear: authorization.exp_year,
          email: customer.email,
          authorisationCode: authorization.authorization_code,
          createdAt: new Date().toISOString(),
        };

        const cardsRef = collection(db, 'payment-methods');
        const docRef = await addDoc(cardsRef, {
          ...cardData,
          createdAt: serverTimestamp(),
        });

        console.log('Card saved successfully:', docRef.id);
      }
    }


    if (event.event === 'charge.success') {
      const { data } = event;

      if (data.metadata?.purpose === 'edit_card_verification') {
        const { id, name } = data.metadata;
        const { authorization, customer } = data;

        const cardData:  Omit<paymentMethodType, 'userId'> = {
          cardHolder: name,
          brand: authorization.brand,
          last4: authorization.last4,
          expiryMonth: authorization.exp_month,
          expiryYear: authorization.exp_year,
          email: customer.email,
          authorisationCode: authorization.authorization_code,
          createdAt: new Date().toISOString(),
        };

        const cardsRef = doc(db, 'payment-methods', id);
        await updateDoc(cardsRef, {
          ...cardData,
          createdAt: serverTimestamp(),
        });

        console.log('Card saved successfully');
      }
    }

    return NextResponse.json({ status: 'success' });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}