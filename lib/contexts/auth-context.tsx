'use client'
import React, {useContext, createContext, useState, useEffect} from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import {auth, db} from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { FirebaseUser } from '@/services/users/types';

interface AppUser extends User {
  uid: string;
}
interface AuthContextType {
    user: AppUser | FirebaseUser | null ;
    loading: boolean
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: false
})

const AuthProvider = ({children} : {children: React.ReactNode}) => {
    const [user, setUser] = useState<AppUser | FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
        if (firebaseUser) {
          // fetch user doc from Firestore
          const docRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(docRef);
  
          if (docSnap.exists()) {
            setUser({ uid: firebaseUser.uid, ...docSnap.data() } as AppUser);
          } else {
            // fallback if doc doesn’t exist
            setUser({uid: firebaseUser.uid, email: firebaseUser.email});
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