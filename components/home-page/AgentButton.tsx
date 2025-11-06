'use client';
import { useAuth } from '@/lib/contexts/auth-context'
import { Bot } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

const AgentButton = () => {
    const {user} = useAuth();
  return (
    <>
          {user && (<Link href='/agent' className="fixed bottom-[100px] right-[30px] z-[10000] flex-shrink-0 size-[55px] rounded-full bg-dark-blue flex items-center justify-center border-[3px] border-white shadow-[0_5px_10px_0_rgba(0,0,0,0.12)]">
          <Bot className="size-7 text-white" />
      </Link>)}
    </>
  )
}

export default AgentButton