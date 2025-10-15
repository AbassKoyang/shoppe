import { useAuth } from '@/lib/contexts/auth-context'
import { useGetAllChats } from '@/services/chat/queries'
import React from 'react'

const page = () => {
    const {user} = useAuth();
    const {isLoading, isError, data: chats} = useGetAllChats(user?.uid || '');
  return (
    <section className='w-full'>
    {chats && (
        chats.map((chat) => (
            <div className='w-full border-b-1 border-gray-300 py-3'>{chat.createdAt}</div>
        ))
    )}
    {isLoading && (
        <p>Loading Chats...</p>
    )}
    {isError && (
        <p>Failed to load Chats.</p>
    )}
    </section>
  )
}

export default page