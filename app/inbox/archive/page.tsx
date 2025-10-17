'use client';
import ChatPreview from '@/components/inbox/ChatPreview';
import EmptyArchive from '@/components/inbox/EmptyArchive';
import EmptyInbox from '@/components/inbox/EmptyInbox';
import EmptySearchResult from '@/components/inbox/EmptySearchResult';
import InboxSkeleton from '@/components/inbox/InboxSkeleton';
import { useAuth } from '@/lib/contexts/auth-context'
import { useInboxContext } from '@/lib/contexts/inbox-context';
import { useGetArchivedChats, useGetBuyingChats } from '@/services/chat/queries'
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

const page = () => {
    const {user} = useAuth();
    const { ref, inView } = useInView();
    const router = useRouter();

    const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    } = useGetArchivedChats(user?.uid || '');

    useEffect(() => {
        if (inView && hasNextPage) {
          fetchNextPage();
        }
      }, [inView, hasNextPage, fetchNextPage]);

    console.log(data);    
    const allChats = useMemo(() => {
        return data?.pages.flatMap(page => page.documents) ;
      }, [data]);
    


    return (
    <section className='w-full overflow-y-auto scrollbar-hide py-4'>
        <div className="w-full bg-white flex items-center justify-between relative">
            <div className="flex gap-4"> 
                <button onClick={() => router.back()}>
                    <ArrowLeft className='size-[25px]' />
                </button>
            <h2 className='font-raleway font-bold text-[28px] tracking-[-0.28px]'>Archived</h2>
            </div>
        </div>
    { allChats && allChats.map((chat) => (
            <ChatPreview key={chat.id} chat={chat} />
    ))}

    {allChats && allChats.length == 0 && isLoading == false && (
       <EmptyArchive />
    )}
    {isLoading && Array.from({length: 10}).map((_,  i) => (
        <InboxSkeleton key={i} />
    ))}
    {isError && (
         <div className='w-full h-[60vh] flex items-center justify-center'>
         <p>Oops, Failed to load Chats.</p>
         </div>
    )}
    <div className='w-full flex items-center justify-center py-3' ref={ref}>
        {isFetchingNextPage ? <LoaderCircle className="animate-spin size-[26px] text-dark-blue" /> : null}
    </div>

    </section>
  )
}

export default page
