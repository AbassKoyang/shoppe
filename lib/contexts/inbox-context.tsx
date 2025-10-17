'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface InboxContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const InboxContext = createContext<InboxContextType | null>(null);

export function useInboxContext() {
  const context = useContext(InboxContext);
  if (!context) {
    throw new Error('useInboxContext must be used within InboxProvider');
  }
  return context;
}

export function InboxProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <InboxContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </InboxContext.Provider>
  );
}