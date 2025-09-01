'use client'

import { useAuth } from '@/lib/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LoaderCircle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  console.log('ProtectedRoute: Current state', { user, loading, isRedirecting }); // Debug log

  useEffect(() => {
    if (!loading && !user && !isRedirecting) {
      console.log('ProtectedRoute: Redirecting to auth'); // Debug log
      setIsRedirecting(true);
      router.push('/auth');
    }
  }, [user, loading, router, isRedirecting]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle className="animate-spin h-8 w-8 text-blue-500" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle className="animate-spin h-8 w-8 text-blue-500" />
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}