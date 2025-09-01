'use client'
import React, {useContext, createContext, useState, useEffect} from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import {auth, db} from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { AppUserType } from '@/services/users/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: AppUserType | null ;
    loading: boolean
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: false
})

const AuthProvider = ({children} : {children: React.ReactNode}) => {
    const router = useRouter();
    const [user, setUser] = useState<AppUserType | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
        if (firebaseUser) {
          // fetch user doc from Firestore
          const docRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(docRef);
  
          if (docSnap.exists()) {
            setUser({ uid: firebaseUser.uid, ...docSnap.data() } as AppUserType);
          } else {
            setUser(null);
            router.push('/auth/signup')
          }
        } else {
          setUser(null); // signed out
        }
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);
    
  return (
    <AuthContext.Provider value={{user, loading}}>
        {children}
    </AuthContext.Provider>
  )
}
export const useAuth = () => useContext(AuthContext);
export default AuthProvider