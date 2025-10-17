import { defaultProfileAvatar } from '@/public/assets/images/exports';
import { ProductType } from '@/services/products/types';
import { AppUserType } from '@/services/users/types';
import { Archive, ArchiveX, ArrowLeft, EllipsisVertical, LoaderCircle, Menu, Phone, Video } from 'lucide-react'
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import ChatProductCard from './ChatProductCard';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { addChatToArchives, removeChatFromArchives } from '@/services/chat/api';
import { toast } from 'react-toastify';
import { chatType } from '@/services/chat/types';


const ChatHeader = ({user, productDetails, userTyping, userOnline, chatDetails} : {user: AppUserType; productDetails: ProductType; userTyping: boolean; userOnline: boolean; chatDetails: chatType;}) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const popUpRef = useRef<HTMLDivElement>(null);
    const queryClient = new QueryClient();

    const addChatToArchivesMutation = useMutation({
        mutationFn: ({chatId} : {chatId: string;}) => addChatToArchives(chatId),
        onSuccess: () => {
            toast.success('Chat added to archive')
          queryClient.invalidateQueries({ queryKey: ['chats']});
        }
    });
    const removeChatsFromArchivesMutation = useMutation({
        mutationFn: ({chatId} : {chatId: string;}) => removeChatFromArchives(chatId),
        onSuccess: () => {
            toast.success('Removed chat from archive')
          queryClient.invalidateQueries({ queryKey: ['chats']});
        }
    });

    const handleAddChatToArchives = async (chatId: string) => {
        try {
            setLoading(true);
          if (!user) {
            toast.error("You must be logged in to add a chat to archive.");
            return;
          }  
          await addChatToArchivesMutation.mutateAsync({chatId: chatId});
          router.back();
        } catch (error: any) {
          console.error("❌ Error adding chats to archive:", error);
      
          if (error?.code === "permission-denied") {
            toast.error("You don’t have permission to add a chat to archive.");
          } else if (error?.message?.includes("network")) {
            toast.error("Network error — check your connection and try again.");
          } else {
            toast.error("Something went wrong while adding chat to archive. Please try again.");
          }
        } finally {
          setLoading(false);
          setIsPopUpOpen(false);
        }
    }
    const handleRemoveChatToArchives = async (chatId: string) => {
        try {
            setLoading(true);
          if (!user) {
            toast.error("You must be logged in to remove a chat to archive.");
            return;
          }  
          await removeChatsFromArchivesMutation.mutateAsync({chatId: chatId});
          router.back();
        } catch (error: any) {
          console.error("❌ Error removing chats from archive:", error);
      
          if (error?.code === "permission-denied") {
            toast.error("You don’t have permission to remove a chat from archive.");
          } else if (error?.message?.includes("network")) {
            toast.error("Network error — check your connection and try again.");
          } else {
            toast.error("Something went wrong while removing chat from archive. Please try again.");
          }
        } finally {
          setLoading(false);
          setIsPopUpOpen(false);
        }
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
          if (popUpRef.current && !popUpRef.current.contains(e.target as Node)) {
            setIsPopUpOpen(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }, []);
      
  return (
    <header className='w-full fixed top-0 left-0 z-100'>
        <div className="w-full px-2 [@media(min-width:375px)]:px-4 py-3 bg-white flex items-center justify-between relative">
            <div className="flex gap-4"> 
                <button onClick={() => router.back()}>
                    <ArrowLeft className='size-[25px]' />
                </button>
            <div className="flex gap-2 items-center">
                <Link href={`/profile/${user.uid}`} className='relative size-[44px] rounded-full overflow-hidden object-contain object-center border-[2px] border-white shadow-[0_5px_10px_0_rgba(0,0,0,0.12)]'>
                    <Image src={user?.profile.imageUrl ? user.profile.imageUrl : defaultProfileAvatar} width={40} height={40}  className='' alt='Profile avatar' />
                </Link>
                <h5 className='text-[20px] text-dark-blue font-bold font-raleway tracking-[-0.2px]'>{user.profile.name}</h5>
            </div>
            </div>
            <div className="flex gap-3 items-center">
                {userTyping && userOnline && (
                    <p className='text-dark-blue text-[12px] italic'>Typing...</p>
                )}
                {userOnline && !userTyping && (
                    <p className='text-dark-blue text-[12px] italic'>Online</p>
                )}
                <div className="relative">
                    <button className='w-fit' onClick={() => setIsPopUpOpen(!isPopUpOpen)}>
                        <EllipsisVertical className='size-[20px]' />
                    </button>
                    <div ref={popUpRef} className={`w-[230px] absolute top-[50%] translate-y-[-50%] left-[-230px] ${isPopUpOpen ? 'block' : 'hidden'} p-1.5 rounded-[6px] bg-white shadow-[0_5px_10px_0_rgba(0,0,0,0.12)] overflow-hidden transition-all duration-300 ease-in-out z-20`}>
                            {chatDetails.archived && (
                                <>
                                {loading ? (
                                <div className='w-full flex items-center justify-between'>
                                <p className='font-raleway text-[16px]'>Removing chat from archive</p>
                                <LoaderCircle className="animate-spin size-[20px] text-dark-blue" /> 
                                </div>
                            ) : (
                                <button onClick={() => handleRemoveChatToArchives(chatDetails.id || '')} className='w-full flex items-center justify-between'>
                                    <p className='font-raleway text-[16px]'>Remove chat from archive</p>
                                    <ArchiveX className='size-[20px] text-[#202020]' />
                                </button>
                            )}
                                </>
                            )}
                            {chatDetails.archived == false && (
                                <>
                                {loading ? (
                                <div className='w-full flex items-center justify-between'>
                                <p className='font-raleway text-[16px]'>Adding chat to archive</p>
                                <LoaderCircle className="animate-spin size-[20px] text-dark-blue" /> 
                                </div>
                            ) : (
                                <button onClick={() => handleAddChatToArchives(chatDetails.id || '')} className='w-full flex items-center justify-between'>
                                    <p className='font-raleway text-[16px]'>Archive chat</p>
                                    <Archive  className='size-[20px] text-[#202020]' />
                                </button>
                            )}
                                </>
                            )}
                        </div>
                </div>
            </div>
            <ChatProductCard product={productDetails} />
        </div>
    </header>
)
}

export default ChatHeader