'use client';

import { useEffect, useState } from 'react';
import { db, requestNotificationPermission } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/lib/contexts/auth-context';

export function EnableNotificationsButton({ userId }: { userId: string }) {
  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const handleRequestPermission = async () => {
    const fcmToken = await requestNotificationPermission();
    
    if (fcmToken) {
      setToken(fcmToken);
      setPermission('granted');
      
      async function saveTokenToFirestore(userId: string, token: string) {
        const ref = doc(db, "users", userId);
        await updateDoc(ref, { token: token});
      }
      saveTokenToFirestore(userId || '', fcmToken)
    }
  };

  if (permission === 'granted') {
    return <p className="text-sm text-green-600">✓ Notifications enabled</p>;
  }

  if (permission === 'denied') {
    return <p className="text-sm text-red-600">Notifications blocked. Enable in browser settings.</p>;
  }

  return (
    <Button onClick={handleRequestPermission} variant="outline">
      Enable Notifications
    </Button>
  );
}