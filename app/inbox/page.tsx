'use client';
import ChatPreview from '@/components/inbox/ChatPreview';
import InboxSkeleton from '@/components/inbox/InboxSkeleton';
import { useAuth } from '@/lib/contexts/auth-context'
import { useGetAllChats } from '@/services/chat/queries'
import React from 'react'

const page = () => {
    const {user} = useAuth();
    const {isLoading, isError, data: chats} = useGetAllChats(user?.uid || '');
  return (
    <section className='w-full overflow-y-auto scrollbar-hide'>
    {chats && chats.map((chat) => (
        <ChatPreview chat={chat} />
    ))}
    {isLoading && Array.from({length: 10}).map(() => (
        <InboxSkeleton />
    ))}
    {isError && (
        <div className='w-full h-[60vh] flex items-center justify-center'>
            <p>Oops, Failed to load Chats.</p>
        </div>
    )}
    </section>
  )
}

export default page
