'use client';
import { messageType } from '@/services/chat/types';
import React, { useEffect, useRef, useState } from 'react'
import ImageGrid from './ImageGrid';
import { useLongPress } from '@/lib/hooks/useLongPress';
import { useAuth } from '@/lib/contexts/auth-context';
import { deleteMessage } from '@/services/chat/api';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const Message = ({m, chatId} : {m: messageType; chatId: string}) => {
    const {user} = useAuth();
    const [isDelete, setIsDelete] = useState(false);
    const [loading, setLoading] = useState(false);
    const deleteButtonRef = useRef<HTMLButtonElement>(null);
    const queryClient = new QueryClient();

    const deleteMessageMutation = useMutation({
        mutationFn: ({chatId, messageId} : {chatId: string; messageId: string}) => deleteMessage(chatId, messageId),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['chatData']});
        }
      });

    const handleDeleteMessage = async () => {
        try {
            setLoading(true);
          if (!user) {
            toast.error("You must be logged in to delete message.");
            return;
          }  
          await deleteMessageMutation.mutateAsync({chatId: chatId, messageId: m.id || ''});
        } catch (error: any) {
          console.error("❌ Error deleting message:", error);
      
          if (error?.code === "permission-denied") {
            toast.error("You don’t have permission to delete a message.");
          } else if (error?.message?.includes("network")) {
            toast.error("Network error — check your connection and try again.");
          } else {
            toast.error("Something went wrong while deleting message. Please try again.");
          }
        } finally {
          setLoading(false);
          setIsDelete(false);
        }
    }

    const handleMessagePress = useLongPress({
        onLongPress: () => {
            if(user?.uid === m.senderId){
                setIsDelete(true);
            }
        },
    })
      
      useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
          if (deleteButtonRef.current && !deleteButtonRef.current.contains(e.target as Node)) {
            setIsDelete(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }, []);

    const rawTs = (m as any).timestamp ?? (m as any).createdAt;
    const resolvedDate = rawTs?.toDate ? rawTs.toDate() : (rawTs instanceof Date ? rawTs : new Date(rawTs));
    const messageDate = isNaN(resolvedDate?.getTime?.()) ? '' : resolvedDate.toLocaleString().substring(11);


    return (
    <div {...handleMessagePress} className={`w-fit flex flex-col mt-2 py-2 px-2 ${m.senderId === user?.uid ? "ml-auto items-end" : "mr-auto items-start"}  ${loading ? 'opacity-60' : 'opacity-100'} relative z-10`}>
        <ImageGrid images={m.images || []} senderId={m.senderId} />
    <p className={`w-fit max-w-[300px] break-words py-2 px-4 mt-2 rounded-4xl ${m.senderId === user?.uid ? "bg-dark-blue text-white" : "bg-[#ebeffaed] text-black font-nunito-sans"} z-10`}>{m.text}</p>
    <span className='mt-0.5 text-[8px] font-nunito-sans text-gray-500 z-10'>{messageDate}</span>
    <button onClick={() => handleDeleteMessage()} ref={deleteButtonRef} className={`absolute top-[50%] translate-y-[-50%] ${m.senderId === user?.uid ? "left-[-120px]" : "right-[-120px]"} left-0 ${isDelete ? 'block' : 'hidden'} p-3 rounded-xl bg-gray-300 text-red-500 font-raleway font-normal overflow-hidden transition-all duration-300 ease-in-out text-[12px] z-20`}>Delete Message</button>
    </div>
  )
}

export default Message