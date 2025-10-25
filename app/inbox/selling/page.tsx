'use client';
import ChatPreview from '@/components/inbox/ChatPreview';
import EmptyInbox from '@/components/inbox/EmptyInbox';
import EmptySearchResult from '@/components/inbox/EmptySearchResult';
import InboxSkeleton from '@/components/inbox/InboxSkeleton';
import { useAuth } from '@/lib/contexts/auth-context'
import { useInboxContext } from '@/lib/contexts/inbox-context';
import { useGetSellingChats } from '@/services/chat/queries'
import { LoaderCircle } from 'lucide-react';
import React, { useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

const page = () => {
    const {user} = useAuth();
    const { ref, inView } = useInView();
    const {searchQuery} = useInboxContext();

    const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    } = useGetSellingChats(user?.uid || '');

    useEffect(() => {
        if (inView && hasNextPage) {
          fetchNextPage();
        }
      }, [inView, hasNextPage, fetchNextPage]);

    console.log(data);    
    const allChats = useMemo(() => {
        return data?.pages.flatMap(page => page.documents) ;
      }, [data]);
    
      const filteredChats = useMemo(() => {
             if (!searchQuery.trim()) return allChats;
            return allChats?.filter(chat => {
            const [partcipant1, partcipant2] = chat.participants;
            const index = partcipant1.uid == user?.uid ? 1 : 0;          
            const hasMatchingMessage = chat.participants[index].profile.name.toLowerCase().includes(searchQuery.toLowerCase());
             return hasMatchingMessage;
        });
      }, [allChats, searchQuery]);
    


    return (
    <section className='w-full overflow-y-auto scrollbar-hide'>
    { filteredChats && filteredChats.map((chat) => (
            <ChatPreview key={chat.id} chat={chat} />
    ))}

    {filteredChats && filteredChats.length == 0 && isLoading == false && (
        <>
       {searchQuery !== '' ? (<EmptySearchResult />) : (<EmptyInbox />)}
       </>
    )}
    {isLoading && Array.from({length: 10}).map((_,  i) => (
        <InboxSkeleton key={i} />
    ))}
    {isError && (
         <div className='w-full h-[60vh] flex items-center justify-center'>
         <p className='font-nunito-sans'>Oops, Failed to load Chats.</p>
         </div>
    )}
    <div className='w-full flex items-center justify-center py-3' ref={ref}>
        {isFetchingNextPage ? <LoaderCircle className="animate-spin size-[26px] text-dark-blue" /> : null}
    </div>

    </section>
  )
}

export default page
